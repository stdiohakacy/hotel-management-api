import { registerAs } from '@nestjs/config';

export default registerAs(
    'storage',
    (): Record<string, any> => ({
        provider: process.env?.STORAGE_PROVIDER ?? 'minio',

        minio: {
            endPoint: process.env.MINIO_ENDPOINT || 'play.min.io',
            port: Number(process.env.MINIO_PORT) || 9000,
            useSSL: Boolean(process.env.MINIO_USE_SSL) || false,
            accessKey: process.env.MINIO_ACCESS_KEY || 'gc2vhjP3tA1BCsymxn9H',
            secretKey:
                process.env.MINIO_SECRET_KEY ||
                'uvlVk0XXO19gYKhYNlt51DPHU1SQLISn58WviQOF',
        },
    })
);
