import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    BadRequestException,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserRegisterDTO } from 'src/modules/user/dtos/user.register.dto';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AppModule } from 'src/app/app.module';
import { UserModule } from 'src/modules/user/user.module';
import { StorageModule } from 'src/modules/storages/storage.module';
import { AuthService } from 'src/core/auth/services/auth.service';
import { UserActiveDTO } from 'src/modules/user/dtos/user.active.dto';

describe('UserService', () => {
    let service: UserService;
    let userRepository: Repository<UserEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule, UserModule, StorageModule, AuthModule],
            providers: [
                UserService,
                AuthService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        userRepository = module.get<Repository<UserEntity>>(
            getRepositoryToken(UserEntity)
        );
    });

    it('Should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Register', () => {
        it('Should throw ConflictException if username exists', async () => {
            const existingUser = {
                id: '0948b3a2-7f3d-4c01-8482-112898ba32bd',
                username: 'existingUser',
                password: 'password',
            } as any;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(
                existingUser
            );

            const registerDTO: UserRegisterDTO = {
                username: 'existingUser',
                password: 'password',
                name: 'Belinda Armstrong',
                address: '30741 Nova Bridge North Sanford 19948-1340 Turkey',
                email: 'Lily_Hickle@yahoo.com',
                phone: '722.319.0849 x116',
            };

            await expect(service.register(registerDTO)).rejects.toThrow(
                ConflictException
            );
        });

        it('Should save user and return user entity if username does not exist', async () => {
            const registerDTO: UserRegisterDTO = {
                username: 'newUser',
                password: 'password',
                name: 'Belinda Armstrong',
                address: '30741 Nova Bridge North Sanford 19948-1340 Turkey',
                email: 'Lily_Hickle@yahoo.com',
                phone: '722.319.0849 x116',
            };

            const savedUser: UserEntity = {
                id: '0948b3a2-7f3d-4c01-8482-112898ba32bd',
                ...registerDTO,
            } as any;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
            jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);

            const registeredUser = await service.register(registerDTO);

            expect(registeredUser).toEqual(savedUser);
        });
    });

    describe('Active', () => {
        it('Should throw NotFoundException if user is not found', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            const activeDTO: UserActiveDTO = {
                username: 'admin',
                activeKey:
                    '306xjims52qarql5rzsn1p72j7yaahs7k72m9qk9ryazbnsfp1wvrcb0bwvy6hn2y9s84sfpn8qdd9zos47p0i42k86qyb4vun4o',
            };

            await expect(service.active(activeDTO)).rejects.toThrow(
                NotFoundException
            );
            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { username: activeDTO.username },
            });
        });

        it('should throw BadRequestException if active key is invalid', async () => {
            // Arrange
            const userActiveDTO: UserActiveDTO = {
                username: 'admin',
                activeKey: 'invalid_active_key',
            };

            const mockUser = {
                id: '0948b3a2-7f3d-4c01-8482-112898ba32bd',
                username: 'admin',
                activeKey:
                    '306xjims52qarql5rzsn1p72j7yaahs7k72m9qk9ryazbnsfp1wvrcb0bwvy6hn2y9s84sfpn8qdd9zos47p0i42k86qyb4vun4o',
                activeExpire: new Date('2024-05-31T00:00:00.000Z'),
            } as any;

            userRepository.findOne = jest.fn().mockResolvedValue(mockUser);

            // Act & Assert
            await expect(service.active(userActiveDTO)).rejects.toThrow(
                BadRequestException
            );
            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { username: userActiveDTO.username },
            });
        });

        it('Should throw BadRequestException if active key is expired', async () => {
            // Arrange
            const userActiveDTO: UserActiveDTO = {
                username: 'admin',
                activeKey:
                    '306xjims52qarql5rzsn1p72j7yaahs7k72m9qk9ryazbnsfp1wvrcb0bwvy6hn2y9s84sfpn8qdd9zos47p0i42k86qyb4vun4o',
            };

            const mockUser = {
                id: '0948b3a2-7f3d-4c01-8482-112898ba32bd',
                username: 'admin',
                activeKey:
                    '306xjims52qarql5rzsn1p72j7yaahs7k72m9qk9ryazbnsfp1wvrcb0bwvy6hn2y9s84sfpn8qdd9zos47p0i42k86qyb4vun4o',
                activeExpire: new Date('2020-05-31T00:00:00.000Z'),
            };

            userRepository.findOne = jest.fn().mockResolvedValue(mockUser);

            // Act & Assert
            await expect(service.active(userActiveDTO)).rejects.toThrow(
                BadRequestException
            );
            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { username: userActiveDTO.username },
            });
        });
    });
});
