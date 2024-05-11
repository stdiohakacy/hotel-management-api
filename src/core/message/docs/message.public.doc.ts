import { applyDecorators } from '@nestjs/common';
import { Doc, DocResponse } from '../../../core/doc/decorators/doc.decorator';
import { MessageLanguageSerialization } from '../../../core/message/serializations/message.language.serialization';

export function MessagePublicLanguageDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.public.message' }),
        DocResponse<MessageLanguageSerialization>('apiKey.languages', {
            serialization: MessageLanguageSerialization,
        })
    );
}
