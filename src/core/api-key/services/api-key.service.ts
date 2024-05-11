import { Injectable } from '@nestjs/common';
import { IApiKeyService } from '../interfaces/api-key.service.interface';
import { IApiKeyCreated } from '../interfaces/api-key.interface';
import { ConfigService } from '@nestjs/config';
import { ApiKeyEntity } from '../../../modules/api-key/entities/api-key.entity';

@Injectable()
export class ApiKeyService implements IApiKeyService {
    private readonly env: string;

    constructor(private readonly configService: ConfigService) {
        this.env = this.configService.get<string>('app.env');
    }
    findAll(_find?: Record<string, any>): Promise<ApiKeyEntity[]> {
        console.log(_find);
        throw new Error('Method not implemented.');
    }
    findOneById(_id: string): Promise<any> {
        console.log(_id);
        throw new Error('Method not implemented.');
    }
    findOne(_find: Record<string, any>): Promise<any> {
        console.log(_find);
        throw new Error('Method not implemented.');
    }
    findOneByKey(_key: string): Promise<any> {
        console.log(_key);
        throw new Error('Method not implemented.');
    }
    findOneByActiveKey(_key: string): Promise<any> {
        console.log(_key);
        throw new Error('Method not implemented.');
    }
    getTotal(_find?: Record<string, any>): Promise<number> {
        console.log(_find);
        throw new Error('Method not implemented.');
    }
    create(): Promise<IApiKeyCreated> {
        throw new Error('Method not implemented.');
    }
    createRaw(): Promise<IApiKeyCreated> {
        throw new Error('Method not implemented.');
    }
    active(_repository: any): Promise<any> {
        console.log(_repository);
        throw new Error('Method not implemented.');
    }
    inactive(_repository: any): Promise<any> {
        console.log(_repository);
        throw new Error('Method not implemented.');
    }
    update(_repository: any): Promise<any> {
        console.log(_repository);
        throw new Error('Method not implemented.');
    }
    updateDate(_repository: any): Promise<any> {
        console.log(_repository);
        throw new Error('Method not implemented.');
    }
    reset(_repository: any, _secret: string): Promise<any> {
        console.log(_repository);
        console.log(_secret);
        throw new Error('Method not implemented.');
    }
    delete(_repository: any): Promise<any> {
        console.log(_repository);
        throw new Error('Method not implemented.');
    }
    validateHashApiKey(
        _hashFromRequest: string,
        _hash: string
    ): Promise<boolean> {
        console.log(_hashFromRequest);
        console.log(_hash);
        throw new Error('Method not implemented.');
    }
    createKey(): Promise<string> {
        throw new Error('Method not implemented.');
    }
    createSecret(): Promise<string> {
        throw new Error('Method not implemented.');
    }
    createHashApiKey(_key: string, _secret: string): Promise<string> {
        console.log(_key);
        console.log(_secret);
        throw new Error('Method not implemented.');
    }
    deleteMany(_find: Record<string, any>): Promise<boolean> {
        console.log(_find);
        throw new Error('Method not implemented.');
    }
    inactiveManyByEndDate(): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}
