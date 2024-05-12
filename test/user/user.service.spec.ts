import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserRegisterDTO } from 'src/modules/user/dtos/user.register.dto';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AppModule } from 'src/app/app.module';
import { UserModule } from 'src/modules/user/user.module';
import { StorageModule } from 'src/modules/storages/storage.module';
import { AuthService } from 'src/core/auth/services/auth.service';
import { UserActiveDTO } from 'src/modules/user/dtos/user.active.dto';
import { ENUM_USER_STATUS } from 'src/modules/user/constants/user.enum.constant';

describe('UserService', () => {
    let userService: UserService;
    let authService: AuthService;
    let userRepository: Repository<UserEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule, UserModule, StorageModule, AuthModule],
            providers: [
                UserService,
                AuthService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useClass: Repository,
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        authService = module.get<AuthService>(AuthService);
        userRepository = module.get<Repository<UserEntity>>(
            getRepositoryToken(UserEntity)
        );
    });

    it('Should be defined', () => {
        expect(userService).toBeDefined();
    });

    describe('Register', () => {
        it('Should throw ConflictException if username exists', async () => {
            const existingUser = {
                id: '0948b3a2-7f3d-4c01-8482-112898ba32bd',
                username: 'existingUser',
                password: 'password',
            } as any;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(
                existingUser
            );

            const registerDTO: UserRegisterDTO = {
                username: 'existingUser',
                password: 'password',
                name: 'Belinda Armstrong',
                address: '30741 Nova Bridge North Sanford 19948-1340 Turkey',
                email: 'Lily_Hickle@yahoo.com',
                phone: '722.319.0849 x116',
            };

            await expect(userService.register(registerDTO)).rejects.toThrow(
                ConflictException
            );
        });

        it('Should save user and return user entity if username does not exist', async () => {
            const registerDTO: UserRegisterDTO = {
                username: 'newUser',
                password: 'password',
                name: 'Belinda Armstrong',
                address: '30741 Nova Bridge North Sanford 19948-1340 Turkey',
                email: 'Lily_Hickle@yahoo.com',
                phone: '722.319.0849 x116',
            };

            const savedUser: UserEntity = {
                id: '0948b3a2-7f3d-4c01-8482-112898ba32bd',
                ...registerDTO,
            } as any;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
            jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);

            const registeredUser = await userService.register(registerDTO);

            expect(registeredUser).toEqual(savedUser);
        });
    });

    describe('Active', () => {
        it('Should throw NotFoundException if user is not found', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            const activeDTO: UserActiveDTO = {
                username: 'admin',
                activeKey:
                    '306xjims52qarql5rzsn1p72j7yaahs7k72m9qk9ryazbnsfp1wvrcb0bwvy6hn2y9s84sfpn8qdd9zos47p0i42k86qyb4vun4o',
            };

            await expect(userService.active(activeDTO)).rejects.toThrow(
                NotFoundException
            );
            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { username: activeDTO.username },
            });
        });

        it('should throw BadRequestException if active key is invalid', async () => {
            // Arrange
            const userActiveDTO: UserActiveDTO = {
                username: 'admin',
                activeKey: 'invalid_active_key',
            };

            const mockUser = {
                id: '0948b3a2-7f3d-4c01-8482-112898ba32bd',
                username: 'admin',
                activeKey:
                    '306xjims52qarql5rzsn1p72j7yaahs7k72m9qk9ryazbnsfp1wvrcb0bwvy6hn2y9s84sfpn8qdd9zos47p0i42k86qyb4vun4o',
                activeExpire: new Date('2024-05-31T00:00:00.000Z'),
            } as any;

            userRepository.findOne = jest.fn().mockResolvedValue(mockUser);

            // Act & Assert
            await expect(userService.active(userActiveDTO)).rejects.toThrow(
                BadRequestException
            );
            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { username: userActiveDTO.username },
            });
        });

        it('Should throw BadRequestException if active key is expired', async () => {
            // Arrange
            const userActiveDTO: UserActiveDTO = {
                username: 'admin',
                activeKey:
                    '306xjims52qarql5rzsn1p72j7yaahs7k72m9qk9ryazbnsfp1wvrcb0bwvy6hn2y9s84sfpn8qdd9zos47p0i42k86qyb4vun4o',
            };

            const mockUser = {
                id: '0948b3a2-7f3d-4c01-8482-112898ba32bd',
                username: 'admin',
                activeKey:
                    '306xjims52qarql5rzsn1p72j7yaahs7k72m9qk9ryazbnsfp1wvrcb0bwvy6hn2y9s84sfpn8qdd9zos47p0i42k86qyb4vun4o',
                activeExpire: new Date('2020-05-31T00:00:00.000Z'),
            };

            userRepository.findOne = jest.fn().mockResolvedValue(mockUser);

            // Act & Assert
            await expect(userService.active(userActiveDTO)).rejects.toThrow(
                BadRequestException
            );
            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { username: userActiveDTO.username },
            });
        });
    });

    describe('Login', () => {
        it('Should throw NotFoundException if user is not found', async () => {
            // Arrange
            const userLoginDTO = {
                username: 'nonExistingUser',
                password: 'password',
            };

            jest.spyOn(userService, 'getByUsername').mockResolvedValue(null);

            // Act & Assert
            await expect(userService.login(userLoginDTO)).rejects.toThrow(
                NotFoundException
            );
            expect(userService.getByUsername).toHaveBeenCalledWith(
                userLoginDTO.username
            );
        });

        it('Should throw BadRequestException if password does not match', async () => {
            // Arrange
            const userLoginDTO = {
                username: 'existingUser',
                password: 'invalidPassword',
            };

            const existingUser = {
                id: '0948b3a2-7f3d-4c01-8482-112898ba32bd',
                username: 'existingUser',
                password: {
                    passwordHash: 'hashedPassword',
                },
                status: ENUM_USER_STATUS.ACTIVE,
            } as any;

            jest.spyOn(userService, 'getByUsername').mockResolvedValue(
                existingUser
            );
            jest.spyOn(authService, 'validateUser').mockResolvedValue(false);

            // Act & Assert
            await expect(userService.login(userLoginDTO)).rejects.toThrow(
                BadRequestException
            );
            expect(userService.getByUsername).toHaveBeenCalledWith(
                userLoginDTO.username
            );
            expect(authService.validateUser).toHaveBeenCalledWith(
                userLoginDTO.password,
                existingUser.password.passwordHash
            );
        });

        it('Should throw ForbiddenException if user is inactive', async () => {
            // Arrange
            const userLoginDTO = {
                username: 'inactiveUser',
                password: 'password',
            };

            const inactiveUser = {
                id: '0948b3a2-7f3d-4c01-8482-112898ba32bd',
                username: 'inactiveUser',
                password: {
                    passwordHash: 'hashedPassword',
                },
                status: ENUM_USER_STATUS.INACTIVE,
            } as any;

            jest.spyOn(userService, 'getByUsername').mockResolvedValue(
                inactiveUser
            );
            jest.spyOn(authService, 'validateUser').mockResolvedValue(true);

            // Act & Assert
            await expect(userService.login(userLoginDTO)).rejects.toThrow(
                ForbiddenException
            );
            expect(userService.getByUsername).toHaveBeenCalledWith(
                userLoginDTO.username
            );
            expect(authService.validateUser).toHaveBeenCalledWith(
                userLoginDTO.password,
                inactiveUser.password.passwordHash
            );
        });

        it('Should return token data if login is successful', async () => {
            // Arrange
            const userLoginDTO = {
                username: 'admin',
                password: 'password',
            };

            const activeUser = {
                id: '0948b3a2-7f3d-4c01-8482-112898ba32bd',
                username: 'admin',
                password: {
                    passwordHash: 'hashedPassword',
                },
                status: ENUM_USER_STATUS.ACTIVE,
            } as any;

            jest.spyOn(userService, 'getByUsername').mockResolvedValue(
                activeUser
            );
            jest.spyOn(authService, 'validateUser').mockResolvedValue(true);

            jest.spyOn(
                authService,
                'createPayloadAccessToken'
            ).mockResolvedValue({});

            jest.spyOn(
                authService,
                'createPayloadRefreshToken'
            ).mockResolvedValue({});
            jest.spyOn(authService, 'getPayloadEncryption').mockResolvedValue(
                false
            );
            jest.spyOn(authService, 'createAccessToken').mockResolvedValue(
                'accessToken'
            );
            jest.spyOn(authService, 'createRefreshToken').mockResolvedValue(
                'refreshToken'
            );
            jest.spyOn(authService, 'checkPasswordExpired').mockResolvedValue(
                false
            );

            // Act
            const result = await userService.login(userLoginDTO);

            // Assert
            expect(result.data.tokenType).toBeDefined();
            expect(result.data.expiresIn).toBeDefined();
            expect(result.data.accessToken).toBeDefined();
            expect(result.data.refreshToken).toBeDefined();
        });

        it('Should throw ForbiddenException if password is expired', async () => {
            // Arrange
            const userLoginDTO = {
                username: 'admin',
                password: 'password',
            };

            const userExpired = {
                id: '0948b3a2-7f3d-4c01-8482-112898ba32bd',
                username: 'admin',
                password: {
                    passwordHash: 'hashedPassword',
                    passwordExpired: true,
                },
                status: ENUM_USER_STATUS.ACTIVE,
            } as any;

            jest.spyOn(userService, 'getByUsername').mockResolvedValue(
                userExpired
            );

            jest.spyOn(authService, 'validateUser').mockResolvedValue(true);

            jest.spyOn(
                authService,
                'createPayloadAccessToken'
            ).mockResolvedValue({});
            jest.spyOn(
                authService,
                'createPayloadRefreshToken'
            ).mockResolvedValue({});
            jest.spyOn(authService, 'getPayloadEncryption').mockResolvedValue(
                false
            );
            jest.spyOn(authService, 'createAccessToken').mockResolvedValue(
                'accessToken'
            );
            jest.spyOn(authService, 'createRefreshToken').mockResolvedValue(
                'refreshToken'
            );
            jest.spyOn(authService, 'checkPasswordExpired').mockResolvedValue(
                true
            );

            // Act & Assert
            await expect(userService.login(userLoginDTO)).rejects.toThrow(
                ForbiddenException
            );
        });
    });
});
