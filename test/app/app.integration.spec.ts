import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app/app.module';
import request from 'supertest';

describe('AppController', () => {
    let app;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it(`/GET hello`, () => {
        return request(app.getHttpServer()).get('/hello').expect(200);
    });

    afterAll(async () => {
        await app.close();
    });
});
