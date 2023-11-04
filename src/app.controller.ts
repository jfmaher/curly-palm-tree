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
import { AppService } from './app.service';
import { AccountStoreService } from './account-store/account-store.service';
import { NewAccountDto } from './newAccountDto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('/credit-cards')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly accountStoreService: AccountStoreService,
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
  chargeAccount(@Param('cardNumber') cardNumber: string) {}

  @Post('/:cardNumber/credit')
  creditAccount(@Param('cardNumber') cardNumber: string) {}
}
