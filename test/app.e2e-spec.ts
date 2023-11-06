import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /credit-cards', () => {
    request(app.getHttpServer()).get('/credit-cards').expect(200);
  });
  describe('POST /credit-cards', () => {
    it('fails validation', () => {
      request(app.getHttpServer())
        .post('/credit-cards')
        .send({
          name: 'test',
          accountIdentifier: 'test',
          limit: 1000,
          cardNo: '4018888881881',
          cardType: 'VISA',
        })
        .expect(400);
    });
    it('succeeds validation', () => {
      request(app.getHttpServer())
        .post('/credit-cards')
        .send({
          name: 'test',
          accountIdentifier: 'test',
          limit: 1000,
          cardNo: '4012888888881881',
          cardType: 'VISA',
        })
        .expect(200);
    });
  });
  it.todo('GET /credit-cards/:id');
  it.todo('PUT /credit-cards/:id');
  it.todo('PATCH /credit-cards/:id');
  it.todo('DELETE /credit-cards/:id');
  it.todo('POST /credit-cards/:cardNo/charge');
  it.todo('POST /credit-cards/:cardNo/credit');
});
