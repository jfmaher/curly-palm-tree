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
  updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() newAccount: NewAccountDto,
  ) {
    return this.accountStoreService.update(id, newAccount);
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
    const account = await this.accountStoreService.getByCardNo(cardNumber);

    if (account.balance + amount > account.limit) throw new Error();

    try {
      await this.paymentGatewayService.payment();
    } catch {
      throw Error();
    }
    account.balance += amount;
    return this.accountStoreService.update(account.id, account);
  }

  @Post('/:cardNumber/credit')
  async creditAccount(
    @Param('cardNumber') cardNumber: string,
    @Body('amount', ParseIntPipe) amount: number,
  ) {
    const account = await this.accountStoreService.getByCardNo(cardNumber);
    account.balance -= amount;
  }
}
