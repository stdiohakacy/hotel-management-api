import { PickType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';

export class UserLoginDTO extends PickType(UserDTO, ['username', 'password']) {}
