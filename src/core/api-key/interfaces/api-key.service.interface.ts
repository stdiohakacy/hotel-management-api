import {
    ApiKeyCreateDto,
    ApiKeyCreateRawDto,
} from '../dtos/api-key.create.dto';
import { ApiKeyUpdateDateDto } from '../dtos/api-key.update-date.dto';
import { ApiKeyUpdateDto } from '../dtos/api-key.update.dto';
import { IApiKeyCreated } from './api-key.interface';
import { ApiKeyEntity } from '../../../modules/api-key/entities/api-key.entity';

export interface IApiKeyService {
    findAll(find?: Record<string, any>): Promise<ApiKeyEntity[]>;
    findOneById(_id: string): Promise<ApiKeyEntity>;
    findOne(find: Record<string, any>): Promise<ApiKeyEntity>;
    findOneByKey(key: string): Promise<ApiKeyEntity>;
    findOneByActiveKey(key: string): Promise<ApiKeyEntity>;
    getTotal(find?: Record<string, any>): Promise<number>;
    create({
        name,
        startDate,
        endDate,
    }: ApiKeyCreateDto): Promise<IApiKeyCreated>;
    createRaw({
        name,
        key,
        secret,
        startDate,
        endDate,
    }: ApiKeyCreateRawDto): Promise<IApiKeyCreated>;
    active(repository: ApiKeyEntity): Promise<ApiKeyEntity>;
    inactive(repository: ApiKeyEntity): Promise<ApiKeyEntity>;
    update(
        repository: ApiKeyEntity,
        { name }: ApiKeyUpdateDto
    ): Promise<ApiKeyEntity>;
    updateDate(
        repository: ApiKeyEntity,
        { startDate, endDate }: ApiKeyUpdateDateDto
    ): Promise<ApiKeyEntity>;
    reset(repository: ApiKeyEntity, secret: string): Promise<ApiKeyEntity>;
    delete(repository: ApiKeyEntity): Promise<ApiKeyEntity>;
    validateHashApiKey(hashFromRequest: string, hash: string): Promise<boolean>;
    createKey(): Promise<string>;
    createSecret(): Promise<string>;
    createHashApiKey(key: string, secret: string): Promise<string>;
    deleteMany(find: Record<string, any>): Promise<boolean>;
    inactiveManyByEndDate(): Promise<boolean>;
}
