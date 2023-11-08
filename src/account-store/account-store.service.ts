import { Injectable } from '@nestjs/common';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import Account from './Account';
import { EncryptionService } from '../encryption-module/encryption/encryption.service';
import { CardDetails } from './CardDetails';
import * as crypto from 'crypto';

@Injectable()
export class AccountStoreService {
  protected repo: Repository<Account>;

  constructor(
    private readonly db: DataSource,
    private readonly encryptionService: EncryptionService,
  ) {
    this.repo = this.db.getRepository(Account);
  }

  save(account: DeepPartial<Account>) {
    if (account.cardDetails.cardNo) {
      const { iv, encryption } = this.encryptionService.encrypt(
        account.cardDetails.cardNo,
      );

      const hash = crypto
        .createHash('sha256')
        .update(account.cardDetails.cardNo)
        .digest('base64');
      account.cardDetails = {
        ...account.cardDetails,
        initializationVectors: iv,
        cardNo: encryption,
        hash,
      };
    }
    return this.repo.save(this.repo.create(account));
  }

  getAll() {
    return this.repo.find();
  }

  getOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  delete(id: number) {
    return this.repo.delete(id);
  }

  async getByCardNo(cardNo: string) {
    const hash = crypto.createHash('sha256').update(cardNo).digest('base64');
    const cardDetails = await this.db.manager.findOne(CardDetails, {
      where: { hash },
      relations: { account: true },
    });

    cardDetails.cardNo = this.encryptionService.decrypt(
      cardDetails.initializationVectors,
      cardDetails.cardNo,
    );
    const account = cardDetails.account;
    account.cardDetails = cardDetails;
    debugger;
    return account;
  }
}
