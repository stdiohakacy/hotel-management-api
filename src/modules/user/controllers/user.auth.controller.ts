import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import {
    UserAuthChangePasswordDoc,
    UserAuthProfileDoc,
    UserAuthRefreshDoc,
    UserAuthUploadProfileDoc,
} from '../docs/user.auth.doc';
import { Response } from '../../../core/response/decorators/response.decorator';
import { UserProfileSerialization } from '../serializations/user.profile.serialization';
import {
    GetUser,
    UserAuthProtected,
    UserProtected,
} from '../decorators/user.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtRefreshProtected,
    AuthJwtToken,
} from '../../../core/auth/decorators/auth.jwt.decorator';
import { UserEntity } from '../entities/user.entity';
import { IResponse } from '../../../core/response/interfaces/response.interface';
import { UserRefreshSerialization } from '../serializations/user.refresh.serialization';
import { AuthService } from '../../../core/auth/services/auth.service';
import { UserChangePasswordDTO } from '../dtos/user.change-password.dto';
import { UploadFileSingle } from '../../../core/file/decorators/file.decorator';
import { FileRequiredPipe } from '../../../core/file/pipes/file.required.pipe';
import { FileSizeImagePipe } from '../../../core/file/pipes/file.size.pipe';
import { FileTypeImagePipe } from '../../../core/file/pipes/file.type.pipe';
import { IFile } from '../../../core/file/interfaces/file.interface';

@ApiTags('modules.auth.user')
@Controller({ version: '1', path: '/user' })
export class UserAuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @UserAuthProfileDoc()
    @Response('user.profile', { serialization: UserProfileSerialization })
    @UserProtected()
    @AuthJwtAccessProtected()
    @Get('/profile')
    async profile(@GetUser() user: UserEntity): Promise<IResponse> {
        return { data: user };
    }

    @UserAuthRefreshDoc()
    @Response('user.refresh', { serialization: UserRefreshSerialization })
    @UserAuthProtected()
    @UserProtected()
    @AuthJwtRefreshProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/refresh')
    async refresh(
        @AuthJwtToken() refreshToken: string,
        @GetUser() userAuth: UserEntity
    ): Promise<IResponse> {
        return await this.userService.refresh(userAuth, refreshToken);
    }

    @UserAuthChangePasswordDoc()
    @Response('user.changePassword')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Patch('/password')
    async changePassword(
        @Body() body: UserChangePasswordDTO,
        @GetUser() userAuth: UserEntity
    ) {
        return await this.userService.updatePassword(body, userAuth);
    }

    @UserAuthUploadProfileDoc()
    @Response('user.upload')
    @UserProtected()
    @AuthJwtAccessProtected()
    @UploadFileSingle('file')
    @HttpCode(HttpStatus.OK)
    @Post('/profile/upload')
    async upload(
        @GetUser() userAuth: UserEntity,
        @UploadedFile(FileRequiredPipe, FileSizeImagePipe, FileTypeImagePipe)
        file: IFile
    ) {
        return await this.userService.uploadAvatar(userAuth, file);
    }
}
