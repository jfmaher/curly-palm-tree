import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountStoreService } from './account-store/account-store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  providers: [AppService, AccountStoreService],
})
export class AppModule {}
