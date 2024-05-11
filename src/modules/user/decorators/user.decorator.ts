import {
    ExecutionContext,
    SetMetadata,
    UseGuards,
    applyDecorators,
    createParamDecorator,
} from '@nestjs/common';
import { UserPayloadPutToRequestGuard } from '../guards/payload/user.payload.put-to-request.guard';
import { UserNotFoundGuard } from '../guards/user.not-found.guard';
import { UserEntity } from '../entities/user.entity';
import { IRequestApp } from '../../../core/request/interfaces/request.interface';
import { USER_ACTIVE_META_KEY } from '../constants/user.constant';
import { UserActiveGuard } from '../guards/user.active.guard';

export function UserProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(UserPayloadPutToRequestGuard, UserNotFoundGuard)
    );
}

export const GetUser = createParamDecorator(
    (returnPlain: boolean, ctx: ExecutionContext): UserEntity => {
        const { __user } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { __user: UserEntity }>();
        return returnPlain ? __user : __user;
    }
);

export function UserAuthProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            // UserBlockedGuard,
            // UserInactivePermanentGuard,
            UserActiveGuard
        ),
        // SetMetadata(USER_INACTIVE_PERMANENT_META_KEY, [false]),
        // SetMetadata(USER_BLOCKED_META_KEY, [false]),
        SetMetadata(USER_ACTIVE_META_KEY, [true])
    );
}
