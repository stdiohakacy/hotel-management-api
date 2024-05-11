import { PickType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';

export class UserRegisterDTO extends PickType(UserDTO, [
    'username',
    'password',
    'name',
    'address',
    'email',
    'phone',
]) {}
