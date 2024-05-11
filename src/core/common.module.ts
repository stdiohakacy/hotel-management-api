import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DebuggerModule } from '../core/debugger/debugger.module';
import { HelperModule } from '../core/helper/helper.module';
import { ErrorModule } from '../core/error/error.module';
import { ResponseModule } from '../core/response/response.module';
import { RequestModule } from '../core/request/request.module';
import { AuthCoreModule } from '../core/auth/auth.core.module';
import { MessageModule } from '../core/message/message.module';
import { PaginationModule } from '../core/pagination/pagination.module';
import Joi from 'joi';
import { ENUM_MESSAGE_LANGUAGE } from './message/constants/message.enum.constant';
import configs from '../configs';
import { ApiKeyModule } from '../core/api-key/api-key.module';
import { DatabaseOptionsModule } from '../core/database/database.options.module';
import { ENUM_APP_ENVIRONMENT } from '../app/constants/app.enum.constant';
import { APP_LANGUAGE } from '../app/constants/app.constant';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseOptionService } from './database/services/database.options.service';
import {
    addTransactionalDataSource,
    getDataSourceByName,
} from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { BullCoreModule } from './queue/bull/bull.core.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
            expandVariables: true,
            validationSchema: Joi.object({
                APP_NAME: Joi.string().required(),
                APP_ENV: Joi.string()
                    .valid(...Object.values(ENUM_APP_ENVIRONMENT))
                    .default('development')
                    .required(),
                APP_LANGUAGE: Joi.string()
                    .valid(...Object.values(ENUM_MESSAGE_LANGUAGE))
                    .default(APP_LANGUAGE)
                    .required(),

                HTTP_ENABLE: Joi.boolean().default(true).required(),
                HTTP_HOST: [
                    Joi.string().ip({ version: 'ipv4' }).required(),
                    Joi.valid('localhost').required(),
                ],
                HTTP_PORT: Joi.number().default(3000).required(),
                HTTP_VERSIONING_ENABLE: Joi.boolean().default(true).required(),
                HTTP_VERSION: Joi.number().required(),

                DEBUGGER_HTTP_WRITE_INTO_FILE: Joi.boolean()
                    .default(false)
                    .required(),
                DEBUGGER_HTTP_WRITE_INTO_CONSOLE: Joi.boolean()
                    .default(false)
                    .required(),
                DEBUGGER_SYSTEM_WRITE_INTO_FILE: Joi.boolean()
                    .default(false)
                    .required(),
                DEBUGGER_SYSTEM_WRITE_INTO_CONSOLE: Joi.boolean()
                    .default(false)
                    .required(),

                JOB_ENABLE: Joi.boolean().default(false).required(),

                DATABASE_HOST: Joi.string().default('127.0.0.1').required(),
                DATABASE_NAME: Joi.string()
                    .default('parking-lot-db')
                    .required(),
                DATABASE_USER: Joi.string().allow(null, 'postgres').optional(),
                DATABASE_PASSWORD: Joi.string()
                    .allow(null, 'postgres')
                    .optional(),

                AUTH_JWT_SUBJECT: Joi.string().required(),
                AUTH_JWT_AUDIENCE: Joi.string().required(),
                AUTH_JWT_ISSUER: Joi.string().required(),

                AUTH_JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string()
                    // .alphanum()
                    .min(5)
                    .max(50000)
                    .required(),
                AUTH_JWT_ACCESS_TOKEN_EXPIRED: Joi.string()
                    .default('15m')
                    .required(),

                AUTH_JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string()
                    // .alphanum()
                    .min(5)
                    .max(50000)
                    .required(),
                AUTH_JWT_REFRESH_TOKEN_EXPIRED: Joi.string()
                    .default('7d')
                    .required(),
                AUTH_JWT_REFRESH_TOKEN_NOT_BEFORE_EXPIRATION: Joi.string()
                    .default('15m')
                    .required(),

                AUTH_JWT_PAYLOAD_ENCRYPT: Joi.boolean()
                    .default(false)
                    .required(),
                AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_KEY: Joi.string()
                    .allow(null, '')
                    .min(20)
                    .max(50)
                    .optional(),
                AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_IV: Joi.string()
                    .allow(null, '')
                    .min(16)
                    .max(50)
                    .optional(),
                AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_KEY: Joi.string()
                    .allow(null, '')
                    .min(20)
                    .max(50)
                    .optional(),
                AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_IV: Joi.string()
                    .allow(null, '')
                    .min(16)
                    .max(50)
                    .optional(),

                AWS_CREDENTIAL_KEY: Joi.string().allow(null, '').optional(),
                AWS_CREDENTIAL_SECRET: Joi.string().allow(null, '').optional(),
                AWS_S3_REGION: Joi.string().allow(null, '').optional(),
                AWS_S3_BUCKET: Joi.string().allow(null, '').optional(),

                SSO_GOOGLE_CLIENT_ID: Joi.string().allow(null, '').optional(),
                SSO_GOOGLE_CLIENT_SECRET: Joi.string()
                    .allow(null, '')
                    .optional(),
                SSO_GOOGLE_CALLBACK_URL_LOGIN: Joi.string()
                    .allow(null, '')
                    .uri()
                    .optional(),
                SSO_GOOGLE_CALLBACK_URL_SIGN_UP: Joi.string()
                    .allow(null, '')
                    .uri()
                    .optional(),

                REDIS_HOST: Joi.string().required(),
                REDIS_PORT: Joi.number().required(),
            }),
            validationOptions: {
                allowUnknown: true,
                abortEarly: true,
            },
        }),

        TypeOrmModule.forRootAsync({
            imports: [DatabaseOptionsModule],
            useFactory: (dbOptionService: DatabaseOptionService) => {
                return dbOptionService.createOption();
            },
            inject: [DatabaseOptionService],
            dataSourceFactory: async (options) => {
                if (!options) {
                    throw new Error('Invalid options passed');
                }
                return (
                    getDataSourceByName('default') ||
                    addTransactionalDataSource(new DataSource(options))
                );
                // return addTransactionalDataSource(new DataSource(options));
            },
        }),
        BullCoreModule,
        MessageModule,
        HelperModule,
        PaginationModule,
        ErrorModule,
        ResponseModule,
        RequestModule,
        ApiKeyModule,
        EventEmitterModule.forRoot(),
        DebuggerModule.forRoot(),
        AuthCoreModule.forRoot(),
    ],
})
export class CommonModule {}
