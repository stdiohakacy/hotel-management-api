import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { ApiKeyModule } from '../core/api-key/api-key.module';
import { AuthCoreModule } from '../core/auth/auth.core.module';
import { CommonModule } from '../core/common.module';

@Module({
    imports: [CommonModule, CommandModule, ApiKeyModule, AuthCoreModule],
    providers: [],
    exports: [],
})
export class MigrationModule {}
