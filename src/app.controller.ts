import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { AccountStoreService } from './account-store/account-store.service';
import { NewAccountDto } from './newAccountDto';
import { PaymentGatewayService } from './payment-gateway/payment-gateway.service';
import errors from './errors';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('/credit-cards')
export class AppController {
  constructor(
    private readonly accountStoreService: AccountStoreService,
    private readonly paymentGatewayService: PaymentGatewayService,
  ) {}

  @Post()
  async createAccount(@Body() newAccount: NewAccountDto) {
    await this.accountStoreService.save(newAccount);
    return '';
  }

  @Get()
  async listAccounts() {
    return await this.accountStoreService.getAll();
  }

  @Get('/:id')
  async getAccount(@Param('id', ParseIntPipe) id: number) {
    return await this.accountStoreService.getOne(id);
  }

  @Put('/:id')
  @Patch('/:id')
  async updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() newAccount: NewAccountDto,
  ) {
    const account = await this.accountStoreService.getOne(id);
    if (account === null) {
      throw new Error(errors.AccountDoesNotExist);
    }
    return this.accountStoreService.save({ ...newAccount, id });
  }

  @Delete('/:id')
  deleteAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountStoreService.delete(id);
  }

  @Post('/:cardNumber/charge')
  async chargeAccount(
    @Param('cardNumber') cardNumber: string,
    @Body('amount', ParseIntPipe) amount: number,
  ) {
    if (amount < 0) throw new Error(errors.NegativeChargeAmount);

    const account = await this.accountStoreService.getByCardNo(cardNumber);

    if (account === null) throw new Error(errors.AccountDoesNotExist);

    if (account.balance + amount > account.limit)
      throw new Error(errors.LimitReached);

    try {
      await this.paymentGatewayService.payment(account.cardNo);
    } catch {
      throw Error(errors.PaymentGatewayFailure);
    }
    account.balance += amount;
    return this.accountStoreService.save(account);
  }

  @Post('/:cardNumber/credit')
  async creditAccount(
    @Param('cardNumber') cardNumber: string,
    @Body('amount', ParseIntPipe) amount: number,
  ) {
    const account = await this.accountStoreService.getByCardNo(cardNumber);
    account.balance -= amount;

    if (account.balance < 0) throw new Error(errors.AttemptingToOverpayBalance);

    return this.accountStoreService.save(account);
  }
}
