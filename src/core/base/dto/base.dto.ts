import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../entity/base.entity';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { faker } from '@faker-js/faker';

export class BaseDTO {
    @ApiProperty({
        name: 'id',
        description: 'base id',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsUUID()
    @Type(() => String)
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;

    @ApiProperty()
    createdBy: string;

    @ApiProperty()
    updatedBy: string;

    @ApiProperty()
    deletedBy: string;

    constructor(entity: BaseEntity, options?: { excludeFields?: boolean }) {
        if (!options?.excludeFields) {
            this.id = entity.id;
            this.createdAt = entity.createdAt;
            this.updatedAt = entity.updatedAt;
            this.deletedAt = entity.deletedAt;
            this.createdBy = entity.createdBy;
            this.updatedBy = entity.updatedBy;
            this.deletedBy = entity.deletedBy;
        }
    }
}
