import { Module } from '@nestjs/common';
import { StorageProviderFactory } from './storage.provider.factory';
@Module({
    imports: [],
    providers: [StorageProviderFactory],
    controllers: [],
    exports: [StorageProviderFactory],
})
export class StorageModule {}
