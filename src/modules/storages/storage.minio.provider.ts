import { Client } from 'minio';
import { IStorage } from './storage.interface';
import { ConfigService } from '@nestjs/config';
import { AwsS3Serialization } from '../../core/aws/serializations/aws.s3.serialization';

export class MinioStorageProvider implements IStorage {
    private minioClient: Client;

    constructor(private readonly configService: ConfigService) {
        this.minioClient = new Client({
            endPoint: this.configService.get<string>('storage.minio.endPoint'),
            port: this.configService.get<number>('storage.minio.port'),
            useSSL: this.configService.get<boolean>('storage.minio.useSSL'),
            accessKey: this.configService.get<string>(
                'storage.minio.accessKey'
            ),
            secretKey: this.configService.get<string>(
                'storage.minio.secretKey'
            ),
        });
        console.log(this.minioClient);
    }

    async uploadFile(
        objectName: string,
        file: Buffer,
        options: any
    ): Promise<AwsS3Serialization> {
        console.log(objectName);
        console.log(file);
        console.log(options);
        return {
            path: 'string',
            pathWithFilename: 'string',
            filename: 'string',
            completedUrl: 'string',
            baseUrl: 'string',
            mime: 'string',
        };
    }
}
