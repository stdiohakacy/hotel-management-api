import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthCoreModule } from '../../core/auth/auth.core.module';
import { UserService } from './services/user.service';
import { StorageModule } from '../storages/storage.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        AuthCoreModule,
        StorageModule,
    ],
    providers: [UserService],
    controllers: [],
    exports: [UserService],
})
export class UserModule {}
