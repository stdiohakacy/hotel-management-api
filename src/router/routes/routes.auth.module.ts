import { Module } from '@nestjs/common';
import { AuthCoreModule } from '../../core/auth/auth.core.module';
import { AwsModule } from '../../core/aws/aws.module';
import { UserAuthController } from '../../modules/user/controllers/user.auth.controller';
import { UserModule } from '../../modules/user/user.module';

@Module({
    controllers: [UserAuthController],
    providers: [],
    exports: [],
    imports: [AuthCoreModule, AwsModule, UserModule],
})
export class RoutesAuthModule {}
