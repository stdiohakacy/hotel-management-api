import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
} from '@nestjs/common';
import { ENUM_USER_STATUS_CODE_ERROR } from '../../../modules/user/constants/user.status-code.constant';
import { UserEntity } from '../entities/user.entity';
import { IRequestApp } from '../../../core/request/interfaces/request.interface';

@Injectable()
export class UserNotFoundGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __user } = context
            .switchToHttp()
            .getRequest<IRequestApp & { __user: UserEntity }>();

        if (!__user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }

        return true;
    }
}
