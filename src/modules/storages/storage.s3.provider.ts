import { Injectable } from '@nestjs/common';
import { IStorage } from './storage.interface';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { IAwsS3PutItemOptions } from '../../core/aws/interfaces/aws.interface';

@Injectable()
export class S3StorageProvider implements IStorage {
    private readonly s3Client: S3;
    private readonly bucket: string;
    private readonly baseUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.s3Client = new S3({
            credentials: {
                accessKeyId:
                    this.configService.get<string>('aws.credential.key'),
                secretAccessKey: this.configService.get<string>(
                    'aws.credential.secret'
                ),
            },
            region: this.configService.get<string>('aws.s3.region'),
        });

        this.bucket = this.configService.get<string>('aws.s3.bucket');
        this.baseUrl = this.configService.get<string>('aws.s3.baseUrl');
    }

    async uploadFile(
        objectName: string,
        file: string | Uint8Array | Buffer | Readable | ReadableStream | Blob,
        options?: IAwsS3PutItemOptions
    ) {
        let path: string = options?.path;
        // const acl: string = options?.acl ? options.acl : 'public-read';

        if (path)
            path = path.startsWith('/') ? path.replace('/', '') : `${path}`;

        const mime: string = objectName
            .substring(objectName.lastIndexOf('.') + 1, objectName.length)
            .toUpperCase();

        const key: string = path ? `${path}/${objectName}` : objectName;

        this.s3Client
            .putObject({
                Bucket: this.bucket,
                Key: key,
                Body: file,
                // ACL: acl,
            })
            .promise();

        return {
            path,
            pathWithFilename: key,
            filename: objectName,
            completedUrl: `${this.baseUrl}/${key}`,
            baseUrl: this.baseUrl,
            mime,
        };
    }

    // downloadFile(bucketName: string, objectName: string): Promise<Buffer> {
    //     return this.s3
    //         .getObject({ Bucket: bucketName, Key: objectName })
    //         .promise()
    //         .then((data) => data.Body as Buffer);
    // }
}
