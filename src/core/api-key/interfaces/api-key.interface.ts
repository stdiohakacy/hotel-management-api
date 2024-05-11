import { ENUM_API_KEY_TYPE } from '../../../core/api-key/constants/api-key.enum.constant';
import { ApiKeyEntity } from '../../../modules/api-key/entities/api-key.entity';

export interface IApiKeyPayload {
    _id: string;
    key: string;
    type: ENUM_API_KEY_TYPE;
    name: string;
}

export interface IApiKeyCreated {
    secret: string;
    doc: ApiKeyEntity;
}
