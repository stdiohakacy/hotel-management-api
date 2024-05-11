import { Column, Entity } from 'typeorm';
import { BaseEntity, IBaseEntity } from '../../../core/base/entity/base.entity';
import { UseDTO } from '../../../core/base/decorator/use-dto.decorator';
import { ApiKeyDTO } from '../../../core/api-key/dtos/api-key.dto';
import { ENUM_API_KEY_TYPE } from '../../../core/api-key/constants/api-key.enum.constant';

export interface IApiKeyEntity extends IBaseEntity<ApiKeyDTO> {
    type: ENUM_API_KEY_TYPE;
    name: string;
    key: string;
    hash: string;
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
}
@Entity({ name: 'api_keys' })
@UseDTO(ApiKeyDTO)
export class ApiKeyEntity
    extends BaseEntity<ApiKeyDTO>
    implements IApiKeyEntity
{
    @Column({
        name: 'type',
        enum: ENUM_API_KEY_TYPE,
        default: ENUM_API_KEY_TYPE.PUBLIC,
    })
    type: ENUM_API_KEY_TYPE;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'key', unique: true })
    key: string;

    @Column({ name: 'hash' })
    hash: string;

    @Column({ name: 'isActive', default: true })
    isActive: boolean;

    @Column({ name: 'startDate', type: 'timestamptz', nullable: true })
    startDate?: Date;

    @Column({ name: 'endDate', type: 'timestamptz', nullable: true })
    endDate?: Date;
}
