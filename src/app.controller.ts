import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AccountStoreService } from './account-store/account-store.service';
import NewAccountDto from './newAccountDto';
import { PaymentGatewayService } from './payment-gateway/payment-gateway.service';
import errors from './errors';
import { CardNoPipe } from './card-no/card-no.pipe';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('/credit-cards')
export class AppController {
  constructor(
    private readonly accountStoreService: AccountStoreService,
    private readonly paymentGatewayService: PaymentGatewayService,
  ) {}

  @Post()
  async createAccount(
    @Body(new ValidationPipe({ whitelist: true })) newAccount: NewAccountDto,
  ) {
    const { accountIdentifier, limit, cardNo, cardType, cardholderName } =
      newAccount;
    await this.accountStoreService.save({
      accountIdentifier,
      limit,
      balance: 0,
      cardDetails: { cardNo, cardType, cardholderName },
    });
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
    @Body(ValidationPipe) newAccount: NewAccountDto,
  ) {
    const account = await this.accountStoreService.getOne(id);
    if (account === null) {
      throw new NotFoundException(errors.AccountDoesNotExist);
    }
    return this.accountStoreService.save({ ...newAccount, id });
  }

  @Delete('/:id')
  deleteAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountStoreService.delete(id);
  }

  @Post('/:cardNumber/charge')
  async chargeAccount(
    @Param('cardNumber', CardNoPipe) cardNumber: string,
    @Body('amount', ParseIntPipe) amount: number,
  ) {
    if (amount < 0) throw new BadRequestException(errors.NegativeChargeAmount);

    const account = await this.accountStoreService.getByCardNo(cardNumber);

    if (account === null)
      throw new NotFoundException(errors.AccountDoesNotExist);

    if (account.balance + amount > account.limit)
      throw new BadRequestException(errors.LimitReached);

    try {
      await this.paymentGatewayService.payment(account.cardDetails.cardNo);
    } catch {
      throw new InternalServerErrorException(errors.PaymentGatewayFailure);
    }
    account.balance += amount;
    return this.accountStoreService.save(account);
  }

  @Post('/:cardNumber/credit')
  async creditAccount(
    @Param('cardNumber', CardNoPipe) cardNumber: string,
    @Body('amount', ParseIntPipe) amount: number,
  ) {
    const account = await this.accountStoreService.getByCardNo(cardNumber);
    account.balance -= amount;

    if (account.balance < 0)
      throw new BadRequestException(errors.AttemptingToOverpayBalance);

    return this.accountStoreService.save(account);
  }
}
