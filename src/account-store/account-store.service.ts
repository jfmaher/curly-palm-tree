import { Injectable } from '@nestjs/common';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import Account from './Account';
import { NewAccountDto } from '../newAccountDto';
import errors from '../errors';

@Injectable()
export class AccountStoreService {
  protected repo: Repository<Account>;

  constructor(private readonly db: DataSource) {
    this.repo = this.db.getRepository(Account);
  }

  save(account: DeepPartial<Account>) {
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

  getByCardNo(cardNo: string) {
    return this.repo.findOneBy({ cardNo });
  }
}
