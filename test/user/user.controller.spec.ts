import {
    BadRequestException,
    HttpStatus,
    INestApplication,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app/app.module';
import { UserModule } from 'src/modules/user/user.module';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
    ENUM_USER_STATUS,
    ENUM_USER_TYPE,
} from 'src/modules/user/constants/user.enum.constant';

describe('User Public Controller', () => {
    let app: INestApplication;
    let userRepository: Repository<UserEntity>;

    beforeEach(async () => {
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
    });

    describe('POST /public/user/active', () => {
        it('Should activate user successfully', async () => {
            const user = await userRepository.findOne({
                where: { username: 'Liana_Mayert68' },
            });
            const { username, activeKey } = user;
            const response = await request(app.getHttpServer())
                .post('/public/user/active')
                .send({ username, activeKey });

            // Expect HTTP status code 200 (OK)
            expect(response.status).toBe(HttpStatus.OK);
        });

        it('Should have valid user', async () => {
            const user = await userRepository.findOne({
                where: { username: 'Liana_Mayert68' },
            });

            expect(user.status).toEqual(ENUM_USER_STATUS.ACTIVE);
            expect(user.activatedAt).not.toBeNull();
            expect(user.activeKey).toEqual('');
            expect(user.activeExpire).toEqual(null);
        });

        it('Should return 400 if active key is invalid', async () => {
            const user = await userRepository.findOne({
                where: { username: 'Liana_Mayert68' },
            });

            const { username } = user;
            // Send a request to activate user with invalid active key
            const response = await request(app.getHttpServer())
                .post('/public/user/active')
                .send({
                    username,
                    activeKey: 'invalid_active_key',
                });

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('Should return 422 if active key is expired', async () => {
            const user = await userRepository.findOne({
                where: { username: 'Liana_Mayert68' },
            });
            user.activeExpire = new Date('2023-01-01');
            await userRepository.save(user);
            const { username, activeKey } = user;
            const response = await request(app.getHttpServer())
                .post('/public/user/active')
                .send({ username, activeKey });
            expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it('Should return 404 if user is not found', async () => {
            // Send a request to activate user
            const response = await request(app.getHttpServer())
                .post('/public/user/active')
                .send({
                    username: 'Liana_Mayert69',
                    activeKey:
                        '306xjims52qarql5rzsn1p72j7yaahs7k72m9qk9ryazbnsfp1wvrcb0bwvy6hn2y9s84sfpn8qdd9zos47p0i42k86qyb4vun4o',
                });
            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe('POST /public/user/login', () => {
        it('Should login successfully with valid credentials', async () => {
            // First, register a user
            const data = {
                username: 'Liana_Mayert69',
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

            // Second, active that user

            const user = await userRepository.findOne({
                where: { username: 'Liana_Mayert69' },
            });

            const { username, activeKey } = user;
            const response = await request(app.getHttpServer())
                .post('/public/user/active')
                .send({ username, activeKey });

            // Expect HTTP status code 200 (OK)
            expect(response.status).toBe(HttpStatus.OK);

            // Then, attempt to login with the registered user's credentials
            const loginData = {
                username: 'Liana_Mayert69',
                password: 'pMYOA9@@!123',
            };
            const userLogin = await request(app.getHttpServer())
                .post('/public/user/login')
                .send(loginData)
                .expect(HttpStatus.OK);

            // Ensure the response contains the expected data
            expect(userLogin.body.data.tokenType).toBeDefined();
            expect(userLogin.body.data.expiresIn).toBeDefined();
            expect(userLogin.body.data.accessToken).toBeDefined();
            expect(userLogin.body.data.refreshToken).toBeDefined();
        });

        it('Should return 404 if user is not found', async () => {
            const loginData = {
                username: 'nonExistingUser',
                password: 'password',
            };
            const response = await request(app.getHttpServer())
                .post('/public/user/login')
                .send(loginData)
                .expect(HttpStatus.NOT_FOUND);

            expect(response.body.message).toEqual('user.error.notFound');
        });

        it('Should return 400 if password is incorrect', async () => {
            const loginData = {
                username: 'Liana_Mayert69',
                password: 'wrongPassword',
            };
            const response = await request(app.getHttpServer())
                .post('/public/user/login')
                .send(loginData)
                .expect(HttpStatus.BAD_REQUEST);

            expect(response.body.message).toEqual(
                'user.error.passwordNotMatch'
            );
        });
    });

    afterAll(async () => {
        await userRepository.delete({
            username: In(['Liana_Mayert68', 'Liana_Mayert69']),
        });
        await app.close();
    });
});
