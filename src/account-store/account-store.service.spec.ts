import { Test, TestingModule } from '@nestjs/testing';
import { AccountStoreService } from './account-store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Account from './Account';
import { CardDetails, Type } from './CardDetails';
import { DataSource } from 'typeorm';
import { EncryptionModuleModule } from '../encryption-module/encryption-module.module';
import { EncryptionService } from '../encryption-module/encryption/encryption.service';

describe('AccountStoreService', () => {
  let service: AccountStoreService;
  let encryptionService: EncryptionService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: 'testDB.sql',
          entities: [Account, CardDetails],
          synchronize: true,
          // logging: 'all',
        }),
        EncryptionModuleModule,
      ],
      providers: [AccountStoreService],
    }).compile();

    service = module.get<AccountStoreService>(AccountStoreService);
    encryptionService = module.get<EncryptionService>(EncryptionService);

    dataSource = await new DataSource({
      type: 'better-sqlite3',
      entities: [Account, CardDetails],
      database: 'testDB.sql',
    }).initialize();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('encrypts and saves card nos', async () => {
    const cardNo = '4012888888881881';
    const account = new Account();
    account.id = Math.round(Math.random() * 1000);
    account.accountIdentifier = 'test';
    account.balance = 0;
    account.limit = 0;
    account.cardDetails = new CardDetails();
    account.cardDetails.cardNo = `${cardNo}`;
    account.cardDetails.cardType = Type.MASTERCARD;
    account.cardDetails.cardholderName = 'joe bloggs';

    const account1 = await service.save(account);

    expect(account1).toBeTruthy();

    const savedAccount = await dataSource.manager.findOne(Account, {
      where: { id: account.id },
      relations: { cardDetails: true },
    });

    expect(savedAccount.cardDetails.cardNo).not.toEqual(cardNo);

    const decryptedString = encryptionService.decrypt(
      savedAccount.cardDetails.initializationVectors,
      savedAccount.cardDetails.cardNo,
    );

    expect(decryptedString).toEqual(cardNo);
  });
  it('is able to find by card no', async () => {
    const cardNo = '4012888888881881';
    const cardType = Type.MASTERCARD;
    const cardholderName = 'joe bloggs';
    const account = new Account();
    account.id = Math.round(Math.random() * 1000);
    account.accountIdentifier = 'test';
    account.balance = 0;
    account.limit = 0;
    account.cardDetails = new CardDetails();
    account.cardDetails.cardNo = `${cardNo}`;
    account.cardDetails.cardType = Type.MASTERCARD;
    account.cardDetails.cardholderName = 'joe bloggs';

    const account1 = await service.save(account);

    const foundAccount = await service.getByCardNo(cardNo);

    expect(foundAccount.cardDetails.cardNo).toEqual(cardNo);
    expect(foundAccount.cardDetails.cardType).toEqual(cardType);
    expect(foundAccount.cardDetails.cardholderName).toEqual(cardholderName);
  });
});
