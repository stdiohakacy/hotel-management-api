import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MessageCustomLanguageMiddleware } from '../../../core/message/middleware/custom-language/message.custom-language.middleware';

@Module({})
export class MessageMiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(MessageCustomLanguageMiddleware).forRoutes('*');
    }
}
