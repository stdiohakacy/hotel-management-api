import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { AuthService } from '../../../core/auth/services/auth.service';
import {
    ENUM_USER_STATUS_CODE_ERROR,
    ENUM_USER_STATUS_CODE_SUCCESS,
} from '../constants/user.status-code.constant';
import { UserEntity } from '../entities/user.entity';
import { ENUM_USER_STATUS } from '../constants/user.enum.constant';
import { UserRegisterDTO } from '../dtos/user.register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLoginDTO } from '../dtos/user.login.dto';
import { ENUM_AUTH_LOGIN_WITH } from '../../../core/auth/constants/auth.enum.constant';
import { randomBytes } from 'crypto';
import { HelperDateService } from '../../../core/helper/services/helper.date.service';
import { ConfigService } from '@nestjs/config';
import { UserActiveDTO } from '../dtos/user.active.dto';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { plainToInstance } from 'class-transformer';
import { UserChangePasswordDTO } from '../dtos/user.change-password.dto';
import { IAuthPassword } from '../../../core/auth/interfaces/auth.interface';
import { IFile } from '../../../core/file/interfaces/file.interface';
import { HelperStringService } from '../../../core/helper/services/helper.string.service';
import { StorageProviderFactory } from '../../../modules/storages/storage.provider.factory';

@Injectable()
export class UserService {
    private readonly uploadPath: string;
    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        private readonly authService: AuthService,
        private readonly helperDateService: HelperDateService,
        private readonly storageProviderFactory: StorageProviderFactory,
        private readonly configService: ConfigService,
        private readonly helperStringService: HelperStringService
    ) {
        this.uploadPath = this.configService.get<string>('user.uploadPath');
    }

    async getById(id: string) {
        return await this.userRepo.findOne({ where: { id } });
    }

    async active(payload: UserActiveDTO) {
        const { username, activeKey } = payload;
        const user = await this.userRepo.findOne({ where: { username } });

        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }

        if (user.activeKey !== activeKey) {
            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_ACTIVE_KEY_INVALID_ERROR,
                message: 'user.error.activeKey.invalid',
            });
        }

        if (user.activeExpire < this.helperDateService.create()) {
            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_ACTIVE_KEY_EXPIRED_ERROR,
                message: 'user.error.activeKey.expired',
            });
        }

        await this.userRepo.save(user.active());
    }

    async getByUsername(username: string) {
        const user = await this.userRepo.findOne({ where: { username } });
        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }

        return user;
    }

    async register(payload: UserRegisterDTO): Promise<UserEntity> {
        const { username, password } = payload;

        const isUsernameExist = await this.userRepo.findOne({
            where: { username },
        });

        if (isUsernameExist) {
            throw new ConflictException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_USERNAME_EXISTS_ERROR,
                message: 'user.error.usernameExist',
            });
        }
        const passwordAuth = await this.authService.createPassword(password);

        const activeKey = randomBytes(32).toString('hex');
        const activeExpire = this.helperDateService.forwardInSeconds(
            3 * 24 * 60 * 60,
            { fromDate: new Date() }
        );

        const user = new UserEntity().register({
            ...payload,
            activeKey,
            activeExpire,
            password: passwordAuth,
        });
        return await this.userRepo.save(user);
    }

    async login(payload: UserLoginDTO) {
        const { username, password } = payload;
        const user = await this.getByUsername(username);

        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }

        const validate: boolean = await this.authService.validateUser(
            password,
            user.password.passwordHash
        );

        if (!validate) {
            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR,
                message: 'user.error.passwordNotMatch',
            });
        }

        if (user.status !== ENUM_USER_STATUS.ACTIVE) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_INACTIVE_ERROR,
                message: 'user.error.inactive',
            });
        }

        const tokenType: string = await this.authService.getTokenType();
        const expiresIn: number =
            await this.authService.getAccessTokenExpirationTime();
        const payloadAccessToken: Record<string, any> =
            await this.authService.createPayloadAccessToken(user);
        const payloadRefreshToken: Record<string, any> =
            await this.authService.createPayloadRefreshToken(user.id, {
                loginWith: ENUM_AUTH_LOGIN_WITH.LOCAL,
            });

        const payloadEncryption = await this.authService.getPayloadEncryption();
        let payloadHashedAccessToken: Record<string, any> | string =
            payloadAccessToken;
        let payloadHashedRefreshToken: Record<string, any> | string =
            payloadRefreshToken;

        if (payloadEncryption) {
            payloadHashedAccessToken =
                await this.authService.encryptAccessToken(payloadAccessToken);
            payloadHashedRefreshToken =
                await this.authService.encryptRefreshToken(payloadRefreshToken);
        }

        const accessToken: string = await this.authService.createAccessToken(
            payloadHashedAccessToken
        );

        const refreshToken: string = await this.authService.createRefreshToken(
            payloadHashedRefreshToken
        );

        const checkPasswordExpired: boolean =
            await this.authService.checkPasswordExpired(
                user.password.passwordExpired
            );

        if (checkPasswordExpired) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_USER_STATUS_CODE_SUCCESS.USER_PASSWORD_EXPIRED_ERROR,
                message: 'user.error.passwordExpired',
            });
        }

        return {
            data: {
                tokenType,
                expiresIn,
                accessToken,
                refreshToken,
            },
        };
    }

    async payloadSerialization(
        data: UserEntity
    ): Promise<UserPayloadSerialization> {
        return plainToInstance(UserPayloadSerialization, data);
    }

    async refresh(userAuth: UserEntity, refreshToken: string) {
        const user = await this.getById(userAuth.id);

        // if (!userWithRole.role.isActive) {
        //     throw new ForbiddenException({
        //         statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_INACTIVE_ERROR,
        //         message: 'role.error.inactive',
        //     });
        // }

        const checkPasswordExpired: boolean =
            await this.authService.checkPasswordExpired(
                user.password.passwordExpired
            );

        if (checkPasswordExpired) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_EXPIRED_ERROR,
                message: 'user.error.passwordExpired',
            });
        }

        const payload: UserPayloadSerialization =
            await this.payloadSerialization(user);
        const tokenType: string = await this.authService.getTokenType();
        const expiresIn: number =
            await this.authService.getAccessTokenExpirationTime();
        const payloadAccessToken: Record<string, any> =
            await this.authService.createPayloadAccessToken(payload);

        const payloadEncryption = await this.authService.getPayloadEncryption();
        let payloadHashedAccessToken: Record<string, any> | string =
            payloadAccessToken;

        if (payloadEncryption) {
            payloadHashedAccessToken =
                await this.authService.encryptAccessToken(payloadAccessToken);
        }

        const accessToken: string = await this.authService.createAccessToken(
            payloadHashedAccessToken
        );

        return {
            data: {
                tokenType,
                expiresIn,
                accessToken,
                refreshToken,
            },
        };
    }

    async updatePassword(body: UserChangePasswordDTO, userAuth: UserEntity) {
        const matchPassword: boolean = await this.authService.validateUser(
            body.oldPassword,
            userAuth.password.passwordHash
        );
        if (!matchPassword) {
            // await this.userService.increasePasswordAttempt(user);

            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR,
                message: 'user.error.passwordNotMatch',
            });
        }

        const newMatchPassword: boolean = await this.authService.validateUser(
            body.newPassword,
            userAuth.password.passwordHash
        );
        if (newMatchPassword) {
            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NEW_MUST_DIFFERENCE_ERROR,
                message: 'user.error.newPasswordMustDifference',
            });
        }
        // await this.userService.resetPasswordAttempt(user);

        const password: IAuthPassword = await this.authService.createPassword(
            body.newPassword
        );

        return await this.userRepo.save(userAuth.updatePassword(password));
    }

    async createPhotoFilename(): Promise<Record<string, any>> {
        const filename: string = this.helperStringService.random(20);

        return {
            path: this.uploadPath,
            filename: filename,
        };
    }

    async uploadAvatar(userAuth: UserEntity, file: IFile) {
        const filename: string = file.originalname;
        const content: Buffer = file.buffer;

        const mime: string = filename
            .substring(filename.lastIndexOf('.') + 1, filename.length)
            .toLowerCase();

        const path = await this.createPhotoFilename();

        const storageProvider = this.storageProviderFactory.initProvider();

        const uploadResponse = await storageProvider.uploadFile(
            `${path.filename}.${mime}`,
            content,
            { path: `${path.path}/f4088da9-f341-442d-b2ec-d7fa42724cf1` }
        );

        if (!uploadResponse) {
        }

        await this.userRepo.save(
            userAuth.updateAvatar(uploadResponse.completedUrl)
        );
    }
}
