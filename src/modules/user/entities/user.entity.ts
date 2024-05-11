import { Column, Entity } from 'typeorm';
import { UserDTO } from '../dtos/user.dto';
import {
    ENUM_USER_STATUS,
    ENUM_USER_TYPE,
} from '../constants/user.enum.constant';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { plainToInstance } from 'class-transformer';
import { BaseEntity, IBaseEntity } from '../../../core/base/entity/base.entity';
import { UseDTO } from '../../../core/base/decorator/use-dto.decorator';
import { IAuthPassword } from '../../../core/auth/interfaces/auth.interface';

export interface IUserEntity extends IBaseEntity<UserDTO> {
    username: string;
    password: IAuthPassword;
    status: ENUM_USER_STATUS;
    name: string;
    address: string;
    email: string;
    phone: string;
}

@Entity({ name: 'users' })
@UseDTO(UserDTO)
export class UserEntity extends BaseEntity<UserDTO> implements IUserEntity {
    @Column({ name: 'username' })
    username: string;

    @Column({ name: 'password', type: 'jsonb' })
    password: IAuthPassword;

    @Column({
        name: 'status',
        enum: ENUM_USER_STATUS,
        default: ENUM_USER_STATUS.ACTIVE,
    })
    status: ENUM_USER_STATUS;

    @Column({
        name: 'type',
        enum: ENUM_USER_TYPE,
        default: ENUM_USER_TYPE.MEMBER,
    })
    type: ENUM_USER_TYPE;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'address' })
    address: string;

    @Column({ name: 'email' })
    email: string;

    @Column({ name: 'phone' })
    phone: string;

    @Column('varchar', { name: 'activeKey', nullable: true })
    activeKey?: string;

    @Column('text', { name: 'avatar', nullable: true })
    avatar?: string;

    @Column('timestamptz', { name: 'activeExpire', nullable: true })
    activeExpire?: Date;

    @Column('timestamptz', { name: 'activatedAt', nullable: true })
    activatedAt?: Date;

    register(payload: any) {
        this.username = payload?.username || '';
        this.password = payload?.password || '';
        this.type = payload?.type || ENUM_USER_TYPE.MEMBER;
        this.name = payload?.name || '';
        this.address = payload?.address || '';
        this.email = payload?.email || '';
        this.phone = payload?.phone || '';
        this.activeKey = payload?.activeKey || '';
        this.activeExpire = payload?.activeExpire;
        this.status = payload?.status || ENUM_USER_STATUS.INACTIVE;

        return this;
    }

    active() {
        this.status = ENUM_USER_STATUS.ACTIVE;
        this.activatedAt = new Date();
        this.activeKey = '';
        this.activeExpire = null;
        return this;
    }

    payloadSerialization(): UserPayloadSerialization {
        return plainToInstance(UserPayloadSerialization, this);
    }

    updatePassword(authPassword: IAuthPassword) {
        this.password.passwordHash = authPassword.passwordHash;
        this.password.passwordExpired = authPassword.passwordExpired;
        this.password.passwordCreated = authPassword.passwordCreated;
        this.password.salt = authPassword.salt;

        return this;
    }

    updateAvatar(url: string) {
        this.avatar = url;
        return this;
    }
}
