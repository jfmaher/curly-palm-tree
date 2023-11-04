import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import Account from './Account';
import { NewAccountDto } from '../newAccountDto';

@Injectable()
export class AccountStoreService {
  protected repo: Repository<Account>;
  constructor(private readonly db: DataSource) {
    this.repo = this.db.getRepository(Account);
  }

  save(account: NewAccountDto) {
    return this.repo.save(account);
  }

  getAll() {
    return this.repo.find();
  }

  getOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  update(id: number, newAccount: NewAccountDto) {
    return this.repo.save({ ...newAccount, id });
  }

  delete(id: number) {
    return this.repo.delete(id);
  }

  charge(cardNo: string) {}
  credit(cardNo: string) {}
}
