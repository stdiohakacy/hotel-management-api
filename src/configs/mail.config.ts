import { registerAs } from '@nestjs/config';

export default registerAs(
    'mail',
    (): Record<string, any> => ({
        provider: process.env?.MAIL_PROVIDER ?? 'console',
    })
);
