import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  it('GET /credit-cards', () => {
    request(app.getHttpServer()).get('/credit-cards').expect(200);
  });
  describe('POST /credit-cards', () => {
    it('fails validation', (done) => {
      request(app.getHttpServer())
        .post('/credit-cards')
        .send({
          accountIdentifier: 'test',
          limit: 1000,
          cardNo: '4018888881881',
          cardType: 'VISA',
          cardholderName: 'Joe Bloggs',
        })
        .expect(400, done);
    });
    it('succeeds validation', (done) => {
      request(app.getHttpServer())
        .post('/credit-cards')
        .send({
          name: 'test',
          accountIdentifier: 'test',
          limit: 1000,
          cardNo: '4012888888881881',
          cardholderName: 'Joe Bloggs',
          cardType: 'VISA',
        })
        .expect(201, done);
    });
    it('fails validation because of property missing', (done) => {
      request(app.getHttpServer())
        .post('/credit-cards')
        .send({
          name: 'test',
          accountIdentifier: 'test',
          limit: 1000,
          cardNo: '4012888888881881',
          cardType: 'VISA',
        })
        .expect(400, done);
    });
    it('fails validation because of negative limit', (done) => {
      request(app.getHttpServer())
        .post('/credit-cards')
        .send({
          name: 'test',
          accountIdentifier: 'test',
          limit: -50,
          cardNo: '4012888888881881',
          cardType: 'VISA',
        })
        .expect(400, done);
    });
  });
  it.todo('GET /credit-cards/:id');
  it.todo('PUT /credit-cards/:id');
  it.todo('PATCH /credit-cards/:id');
  it.todo('DELETE /credit-cards/:id');
  describe('POST /credit-cards/:cardNo/charge', () => {
    it('it returns correct error code (400) for negative amount', (done) => {
      request(app.getHttpServer())
        .post('/credit-cards/4012888888881881/charge')
        .send({
          amount: -49,
        })
        .expect(400, done);
    });
  });
  it.todo('POST /credit-cards/:cardNo/credit');
});
