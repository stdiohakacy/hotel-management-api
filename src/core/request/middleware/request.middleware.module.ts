import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import {
    RequestJsonBodyParserMiddleware,
    RequestRawBodyParserMiddleware,
    RequestTextBodyParserMiddleware,
    RequestUrlencodedBodyParserMiddleware,
} from '../../../core/request/middleware/body-parser/request.body-parser.middleware';
import { RequestCorsMiddleware } from '../../../core/request/middleware/cors/request.cors.middleware';
import { RequestHelmetMiddleware } from '../../../core/request/middleware/helmet/request.helmet.middleware';
import { RequestIdMiddleware } from '../../../core/request/middleware/id/request.id.middleware';
import { RequestTimestampMiddleware } from '../../../core/request/middleware/timestamp/request.timestamp.middleware';
import { RequestTimezoneMiddleware } from '../../../core/request/middleware/timezone/request.timezone.middleware';
import { RequestUserAgentMiddleware } from '../../../core/request/middleware/user-agent/request.user-agent.middleware';

import { RequestVersionMiddleware } from '../../../core/request/middleware/version/request.version.middleware';

@Module({})
export class RequestMiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(
                RequestHelmetMiddleware,
                RequestIdMiddleware,
                RequestJsonBodyParserMiddleware,
                RequestTextBodyParserMiddleware,
                RequestRawBodyParserMiddleware,
                RequestUrlencodedBodyParserMiddleware,
                RequestCorsMiddleware,
                RequestVersionMiddleware,
                RequestUserAgentMiddleware,
                RequestTimestampMiddleware,
                RequestTimezoneMiddleware
            )
            .forRoutes('*');
    }
}
