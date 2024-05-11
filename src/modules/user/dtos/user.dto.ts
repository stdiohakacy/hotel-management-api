import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    ValidateIf,
} from 'class-validator';
import { BaseDTO } from '../../../core/base/dto/base.dto';
import {
    ENUM_USER_STATUS,
    ENUM_USER_TYPE,
} from '../constants/user.enum.constant';

export class UserDTO extends BaseDTO {
    @ApiProperty({
        example: faker.internet.userName({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        }),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(30)
    @Type(() => String)
    username: string;

    @ApiProperty({
        description: 'string password',
        example: `${faker.string.alphanumeric().toLowerCase()}${faker.string
            .alphanumeric(5)
            .toUpperCase()}@@!123`,
        required: true,
    })
    @IsNotEmpty()
    // @IsPasswordStrong()
    @MaxLength(50)
    password: string;

    @ApiProperty({
        description: '',
        example: ENUM_USER_STATUS.ACTIVE,
        required: true,
    })
    @IsEnum(ENUM_USER_STATUS)
    @IsString()
    @IsNotEmpty()
    status: ENUM_USER_STATUS;

    @ApiProperty({
        name: 'name',
        description: 'Full name of user',
        example: faker.person.fullName(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    name: string;

    @ApiProperty({
        name: 'address',
        description: 'Address of user',
        example: `${faker.location.streetAddress()} ${faker.location.city()} ${faker.location.zipCode()} ${faker.location.country()}`,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    address: string;

    @ApiProperty({
        name: 'email',
        description: faker.internet.email(),
        example: faker.internet.email(),
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    email: string;

    @ApiProperty({
        name: 'phone',
        description: 'phone number',
        example: faker.phone.number(),
        required: true,
    })
    @IsString()
    @IsOptional()
    // @MinLength(10)
    // @MaxLength(14)
    @ValidateIf((e) => e.mobileNumber !== '')
    @Type(() => String)
    // @MobileNumberAllowed()
    phone: string;

    @ApiProperty({
        name: 'type',
        description: 'user type',
        example: ENUM_USER_TYPE.MEMBER,
        required: true,
    })
    @IsEnum(ENUM_USER_TYPE)
    @IsString()
    @IsNotEmpty()
    type: ENUM_USER_TYPE;

    @ApiProperty({
        name: 'activeKey',
        description: 'Active key of user',
        example: `3ed5956da5ea3bb9d88133dda7934ce5408e17c4d428d2cdc3e32210990dc114`,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    activeKey: string;
}
