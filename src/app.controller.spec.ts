import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AccountStoreService } from './account-store/account-store.service';
import { PaymentGatewayService } from './payment-gateway/payment-gateway.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AccountStoreService, PaymentGatewayService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('crud', () => {
    it.todo('create');
    it.todo('get');
    it.todo('list');
    it.todo('update');
    it.todo('delete');
  });

  describe('charges', () => {
    it.todo('charge amount under limit');
    it.todo('charge amount over limit');
    it.todo('charge a negative amount');
    it.todo('payment gateway succeeded');
    it.todo('payment gateway failed');
  });

  describe('credit', () => {
    it.todo('payment within balance');
    it.todo('payment overpays balance');
  });
});
