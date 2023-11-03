import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AccountStoreService } from './account-store/account-store.service';
import { AccountDto } from './accountDto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('/credit-cards')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly accountStoreService: AccountStoreService,
  ) {}

  @Post()
  async createAccount(@Body() newAccount: AccountDto) {
    await this.accountStoreService.save(newAccount);
    return '';
  }

  @Get()
  async listAccounts() {
    return await this.accountStoreService.getAll();
  }

  @Get('/:id')
  getAccount(@Param('id') id: string) {}

  @Put('/:id')
  updateAccount(@Param('id') id: string) {}

  @Delete('/:id')
  deleteAccount(@Param('id') id: string) {}

  @Post('/:cardNumber/charge')
  chargeAccount(@Param('cardNumber') cardNumber: string) {}

  @Post('/:cardNumber/credit')
  creditAccount(@Param('cardNumber') cardNumber: string) {}
}
