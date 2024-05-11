import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    UserPublicActiveDoc,
    UserPublicLoginDoc,
    UserPublicRegisterDoc,
} from '../docs/user.public.doc';
import { UserRegisterDTO } from '../dtos/user.register.dto';
import { Response } from '../../../core/response/decorators/response.decorator';
import { UserLoginSerialization } from '../serializations/user.login.serialization';
import { UserLoginDTO } from '../dtos/user.login.dto';
import { UserService } from '../services/user.service';
import { UserActiveDTO } from '../dtos/user.active.dto';

@ApiTags('modules.public.user')
@Controller({ version: '1', path: '/user' })
export class UserPublicController {
    constructor(private readonly userService: UserService) {}

    @UserPublicRegisterDoc()
    @Response('user.register')
    @HttpCode(HttpStatus.CREATED)
    @Post('/register')
    async register(@Body() payload: UserRegisterDTO) {
        return await this.userService.register(payload);
    }

    @UserPublicLoginDoc()
    @Response('user.login', { serialization: UserLoginSerialization })
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async login(@Body() payload: UserLoginDTO) {
        return await this.userService.login(payload);
    }

    @UserPublicActiveDoc()
    @Response('user.active')
    @HttpCode(HttpStatus.OK)
    @Post('/active')
    async active(@Body() payload: UserActiveDTO) {
        return await this.userService.active(payload);
    }
}
