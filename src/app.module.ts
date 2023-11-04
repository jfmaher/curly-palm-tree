import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AccountStoreService } from './account-store/account-store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentGatewayService } from './payment-gateway/payment-gateway.service';
import Account from './account-store/Account';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'accounts.sql',
      entities: [Account],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AccountStoreService, PaymentGatewayService],
})
export class AppModule {}
