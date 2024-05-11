import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserProfileSerialization } from '../../../modules/user/serializations/user.profile.serialization';

export class UserPayloadSerialization extends OmitType(
    UserProfileSerialization,
    ['photo', 'signUpDate', 'createdAt', 'updatedAt'] as const
) {
    @ApiHideProperty()
    @Exclude()
    readonly createdAt: number;

    @ApiHideProperty()
    @Exclude()
    readonly updatedAt: number;
}
