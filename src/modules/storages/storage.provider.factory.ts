import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENUM_STORAGE_PROVIDER_TYPE } from './storage.enum.constant';
import { S3StorageProvider } from './storage.s3.provider';
import { MinioStorageProvider } from './storage.minio.provider';
import { ENUM_STORAGE_STATUS_CODE_ERROR } from './storage.status-code.constant';

@Injectable()
export class StorageProviderFactory {
    constructor(private readonly configService: ConfigService) {}

    initProvider() {
        const providerType = this.configService.get<string>('storage.provider');
        switch (providerType) {
            case ENUM_STORAGE_PROVIDER_TYPE.S3:
                return new S3StorageProvider(this.configService);
            case ENUM_STORAGE_PROVIDER_TYPE.MINIO:
                return new MinioStorageProvider(this.configService);
            default:
                throw new NotFoundException({
                    statusCode:
                        ENUM_STORAGE_STATUS_CODE_ERROR.STORAGE_NOT_FOUND_ERROR,
                    message: 'storage.error.notFound',
                });
        }
    }
}
