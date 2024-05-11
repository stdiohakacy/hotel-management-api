import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyXApiKeyStrategy } from '../../core/api-key/guards/x-api-key/api-key.x-api-key.strategy';
import { ApiKeyService } from '../../core/api-key/services/api-key.service';
import { ApiKeyEntity } from '../../modules/api-key/entities/api-key.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ApiKeyEntity])],
    controllers: [],
    providers: [ApiKeyService, ApiKeyXApiKeyStrategy],
    exports: [ApiKeyService],
})
export class ApiKeyModule {}
