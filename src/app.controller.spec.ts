import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AccountStoreService } from './account-store/account-store.service';
import { PaymentGatewayService } from './payment-gateway/payment-gateway.service';
import errors from './errors';

describe('AppController', () => {
  let appController: AppController;
  let accountStoreServiceStub: Record<keyof AccountStoreService, jest.Mock>;
  let paymentGatewayServiceStub: Record<keyof PaymentGatewayService, jest.Mock>;

  beforeEach(async () => {
    accountStoreServiceStub = {
      save: jest.fn((id) => id),
      getAll: jest.fn((id) => id),
      getOne: jest.fn((id) => id),
      delete: jest.fn((id) => id),
      getByCardNo: jest.fn((id) => id),
    };

    paymentGatewayServiceStub = {
      payment: jest.fn((id) => id),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AccountStoreService, useValue: accountStoreServiceStub },
        { provide: PaymentGatewayService, useValue: paymentGatewayServiceStub },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('crud', () => {
    it.todo('create');
    it.todo('get');
    it.todo('list');
    it.todo('update');
    it.todo('delete');
  });

  describe('charges', () => {
    it('increases balance when the amount is under limit', () => {
      accountStoreServiceStub.getByCardNo.mockImplementationOnce(() => ({
        id: 42,
        balance: 0,
        limit: 100,
        cardDetails: { cardNo: '4012888888881881' },
      }));
      return expect(
        appController.chargeAccount('1234', 50),
      ).resolves.toMatchObject({
        balance: 50,
      });
    });
    it('causes error when charge amount over limit', () => {
      accountStoreServiceStub.getByCardNo.mockImplementationOnce(() => ({
        id: 42,
        balance: 0,
        limit: 45,
        cardDetails: { cardNo: '4012888888881881' },
      }));
      return expect(
        appController.chargeAccount('1234', 50),
      ).rejects.toBeInstanceOf(Error);
    });
    it('cannot charge a negative amount', () => {
      accountStoreServiceStub.getByCardNo.mockImplementationOnce(() => ({
        id: 42,
        balance: 0,
        limit: 45,
        cardDetails: { cardNo: '4012888888881881' },
      }));
      return expect(appController.chargeAccount('1234', -50)).rejects.toThrow(
        errors.NegativeChargeAmount,
      );
    });
    it('payment gateway succeeded', () => {
      accountStoreServiceStub.getByCardNo.mockImplementationOnce(() => ({
        id: 42,
        balance: 0,
        limit: 100,
        cardDetails: { cardNo: '4012888888881881' },
      }));
      paymentGatewayServiceStub.payment.mockResolvedValueOnce(undefined);
      return expect(
        appController.chargeAccount('1234', 50),
      ).resolves.not.toContain({ balance: 50 });
    });
    it('payment gateway failed', () => {
      accountStoreServiceStub.getByCardNo.mockImplementationOnce(() => ({
        id: 42,
        balance: 0,
        limit: 100,
        cardDetails: { cardNo: '4012888888881881' },
      }));
      paymentGatewayServiceStub.payment.mockRejectedValueOnce(new Error());
      return expect(appController.chargeAccount('1234', 50)).rejects.toThrow(
        errors.PaymentGatewayFailure,
      );
    });
    it('card does not exist', () => {
      accountStoreServiceStub.getByCardNo.mockImplementationOnce(() => null);
      return expect(appController.chargeAccount('1234', 50)).rejects.toThrow(
        errors.AccountDoesNotExist,
      );
    });
  });

  describe('credit', () => {
    it('payment within balance', () => {
      accountStoreServiceStub.getByCardNo.mockImplementationOnce(() => ({
        id: 42,
        balance: 100,
        limit: 100,
        cardDetails: { cardNo: '4012888888881881' },
      }));
      paymentGatewayServiceStub.payment.mockRejectedValueOnce(new Error());
      return expect(
        appController.creditAccount('1234', 50),
      ).resolves.toMatchObject({ balance: 50 });
    });
    it('payment overpays balance', () => {
      accountStoreServiceStub.getByCardNo.mockImplementationOnce(() => ({
        id: 42,
        balance: 33,
        limit: 100,
        cardDetails: { cardNo: '4012888888881881' },
      }));
      paymentGatewayServiceStub.payment.mockRejectedValueOnce(new Error());
      return expect(appController.creditAccount('1234', 50)).rejects.toThrow(
        errors.AttemptingToOverpayBalance,
      );
    });
    it('cannot credit a negative amount', () => {
      accountStoreServiceStub.getByCardNo.mockImplementationOnce(() => ({
        id: 42,
        balance: 0,
        limit: 45,
        cardDetails: { cardNo: '4012888888881881' },
      }));
      return expect(appController.creditAccount('1234', -50)).rejects.toThrow(
        errors.NegativeChargeAmount,
      );
    });
  });
});
