import { Module } from '@nestjs/common';
import { ApiKeyModule } from '../../core/api-key/api-key.module';
import { AuthCoreModule } from '../../core/auth/auth.core.module';

@Module({
    controllers: [],
    providers: [],
    exports: [],
    imports: [ApiKeyModule, AuthCoreModule],
})
export class RoutesAdminModule {}
