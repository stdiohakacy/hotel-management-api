import { Module } from '@nestjs/common';
import { AwsModule } from '../core/aws/aws.module';
import { HealthAwsS3Indicator } from '../health/indicators/health.aws-s3.indicator';

@Module({
    providers: [HealthAwsS3Indicator],
    exports: [HealthAwsS3Indicator],
    imports: [AwsModule],
})
export class HealthModule {}
