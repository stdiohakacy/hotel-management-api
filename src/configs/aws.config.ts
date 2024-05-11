import { registerAs } from '@nestjs/config';

export default registerAs(
    'aws',
    (): Record<string, any> => ({
        credential: {
            key: process.env.AWS_CREDENTIAL_KEY,
            secret: process.env.AWS_CREDENTIAL_SECRET,
            region: process.env.AWS_REGION || 'ap-southeast-1',
        },
        s3: {
            bucket: process.env.AWS_S3_BUCKET ?? 'parking-lot-app-s3',
            region: process.env.AWS_S3_REGION || 'ap-southeast-1',
            baseUrl: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com`,
        },
        ses: {
            fromAddress:
                process.env.AWS_SES_FROM_ADDRESS ||
                'nguyendangduy2210@gmail.com',
        },
    })
);
