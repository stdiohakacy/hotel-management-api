import { Module } from '@nestjs/common';
import { ApiKeyModule } from '../../core/api-key/api-key.module';

@Module({
    controllers: [],
    providers: [],
    exports: [],
    imports: [ApiKeyModule],
})
export class RoutesUserModule {}
