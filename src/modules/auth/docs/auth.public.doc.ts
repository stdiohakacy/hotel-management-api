import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../../../core/doc/constants/doc.enum.constant';
import {
    Doc,
    DocRequest,
    DocResponse,
} from '../../../core/doc/decorators/doc.decorator';

export function AuthPublicRegisterDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.public.auth' }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('auth.register', { httpStatus: HttpStatus.CREATED })
    );
}
