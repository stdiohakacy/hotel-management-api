import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    DiskHealthIndicator,
    HealthCheck,
    HealthCheckService,
    MemoryHealthIndicator,
} from '@nestjs/terminus';
import { Response } from '../../core/response/decorators/response.decorator';
import { IResponse } from '../../core/response/interfaces/response.interface';
import { HealthCheckDoc } from '../../health/docs/health.doc';
import { HealthAwsS3Indicator } from '../../health/indicators/health.aws-s3.indicator';
import { HealthSerialization } from '../../health/serializations/health.serialization';

@ApiTags('health')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/health',
})
export class HealthPublicController {
    constructor(
        // @DatabaseConnection() private readonly databaseConnection: Connection,
        private readonly health: HealthCheckService,
        private readonly memoryHealthIndicator: MemoryHealthIndicator,
        private readonly diskHealthIndicator: DiskHealthIndicator,
        private readonly awsS3Indicator: HealthAwsS3Indicator
    ) {}

    @HealthCheckDoc()
    @Response('health.check', { serialization: HealthSerialization })
    @HealthCheck()
    @Get('/aws')
    async checkAws(): Promise<IResponse> {
        const data = await this.health.check([
            () => this.awsS3Indicator.isHealthy('awsS3Bucket'),
        ]);

        return {
            data,
        };
    }

    // @HealthCheckDoc()
    // @Response('health.check', { serialization: HealthSerialization })
    // @HealthCheck()
    // @Get('/database')
    // async checkDatabase(): Promise<IResponse> {
    //     const data = await this.health.check([
    //         () =>
    //             this.mongooseIndicator.pingCheck('database', {
    //                 connection: this.databaseConnection,
    //             }),
    //     ]);

    //     return {
    //         data,
    //     };
    // }

    @HealthCheckDoc()
    @Response('health.check', { serialization: HealthSerialization })
    @HealthCheck()
    @Get('/memory-heap')
    async checkMemoryHeap(): Promise<IResponse> {
        const data = await this.health.check([
            () =>
                this.memoryHealthIndicator.checkHeap(
                    'memoryHeap',
                    300 * 1024 * 1024
                ),
        ]);

        return {
            data,
        };
    }

    @HealthCheckDoc()
    @Response('health.check', { serialization: HealthSerialization })
    @HealthCheck()
    @Get('/memory-rss')
    async checkMemoryRss(): Promise<IResponse> {
        const data = await this.health.check([
            () =>
                this.memoryHealthIndicator.checkRSS(
                    'memoryRss',
                    300 * 1024 * 1024
                ),
        ]);

        return {
            data,
        };
    }

    @HealthCheckDoc()
    @Response('health.check', { serialization: HealthSerialization })
    @HealthCheck()
    @Get('/storage')
    async checkStorage(): Promise<IResponse> {
        const data = await this.health.check([
            () =>
                this.diskHealthIndicator.checkStorage('diskHealth', {
                    thresholdPercent: 0.75,
                    path: '/',
                }),
        ]);

        return {
            data,
        };
    }
}
