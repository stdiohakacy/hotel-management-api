import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                redis: {
                    host: configService.get('REDIS_HOST'),
                    port: Number(configService.get('REDIS_PORT')),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [],
    controllers: [],
    exports: [],
})
export class BullCoreModule {}
