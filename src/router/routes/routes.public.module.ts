import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from '../../health/health.module';
import { HealthPublicController } from '../../health/controllers/health.public.controller';
import { MessagePublicController } from '../../core/message/controllers/message.public.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UserPublicController } from '../../modules/user/controllers/user.public.controller';
import { UserModule } from '../../modules/user/user.module';

@Module({
    imports: [CqrsModule, UserModule, TerminusModule, HealthModule, UserModule],
    controllers: [
        HealthPublicController,
        MessagePublicController,
        UserPublicController,
    ],
    providers: [],
    exports: [],
})
export class RoutesPublicModule {}
