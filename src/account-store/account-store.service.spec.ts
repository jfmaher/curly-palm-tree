import { Test, TestingModule } from '@nestjs/testing';
import { AccountStoreService } from './account-store.service';

describe('AccountStoreService', () => {
  let service: AccountStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountStoreService],
    }).compile();

    service = module.get<AccountStoreService>(AccountStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
