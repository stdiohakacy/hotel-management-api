import { applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../../../core/doc/constants/doc.enum.constant';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocRequestFile,
    DocResponse,
} from '../../../core/doc/decorators/doc.decorator';
import { UserProfileSerialization } from '../serializations/user.profile.serialization';
import { UserRefreshSerialization } from '../serializations/user.refresh.serialization';

export function UserAuthChangePasswordDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.user' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('user.changePassword')
    );
}

export function UserAuthProfileDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.user' }),
        DocAuth({ jwtAccessToken: true }),
        DocResponse<UserProfileSerialization>('user.profile', {
            serialization: UserProfileSerialization,
        })
    );
}

export function UserAuthRefreshDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.user' }),
        DocAuth({ jwtRefreshToken: true }),
        DocResponse<UserRefreshSerialization>('user.refresh', {
            serialization: UserRefreshSerialization,
        })
    );
}

export function UserAuthUploadProfileDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.user' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequestFile(),
        DocResponse('user.upload')
    );
}
