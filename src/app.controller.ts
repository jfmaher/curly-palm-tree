import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/credit-cards')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  createAccount() {}

  @Get()
  listAccounts() {}

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
