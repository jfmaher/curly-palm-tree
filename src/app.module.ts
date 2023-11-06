import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AccountStoreService } from './account-store/account-store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentGatewayService } from './payment-gateway/payment-gateway.service';
import { EncryptionModuleModule } from './encryption-module/encryption-module.module';
import Account from './account-store/Account';
import { CardDetails } from './account-store/CardDetails';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'accounts.sql',
      entities: [Account, CardDetails],
      synchronize: true,
    }),
    EncryptionModuleModule,
  ],
  controllers: [AppController],
  providers: [AccountStoreService, PaymentGatewayService],
})
export class AppModule {}
