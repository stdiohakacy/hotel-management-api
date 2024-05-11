import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app/app.module';
import { UserModule } from 'src/modules/user/user.module';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
    ENUM_USER_STATUS,
    ENUM_USER_TYPE,
} from 'src/modules/user/constants/user.enum.constant';

describe('User Public Controller', () => {
    let app: INestApplication;
    let userRepository: Repository<UserEntity>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UserModule, AppModule],
            providers: [
                {
                    provide: getRepositoryToken(UserEntity),
                    useClass: Repository,
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        userRepository = moduleFixture.get<Repository<UserEntity>>(
            getRepositoryToken(UserEntity)
        );
    });

    describe('POST /public/user/register', () => {
        it('Should register a new user', async () => {
            const data = {
                username: 'Liana_Mayert68',
                password: 'pMYOA9@@!123',
                name: 'Belinda Armstrong',
                address: '30741 Nova Bridge North Sanford 19948-1340 Turkey',
                email: 'Lily_Hickle@yahoo.com',
                phone: '722.319.0849 x116',
            };

            await request(app.getHttpServer())
                .post('/public/user/register')
                .send(data)
                .expect(HttpStatus.CREATED);
        });

        it('Should have valid user', async () => {
            const user = await userRepository.findOne({
                where: { username: 'Liana_Mayert68' },
            });

            expect(user.activeKey).not.toBeNull();
            expect(user.activeExpire).not.toBeNull();
            expect(user.status).toEqual(ENUM_USER_STATUS.INACTIVE);
            expect(user.type).toEqual(ENUM_USER_TYPE.MEMBER);
        });

        it('Should delete the registered user', async () => {
            await userRepository.delete({ username: 'Liana_Mayert68' });
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
