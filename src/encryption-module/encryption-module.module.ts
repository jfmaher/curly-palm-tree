import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption/encryption.service';
import { open } from 'node:fs/promises';

@Module({
  providers: [
    {
      provide: 'KEY',
      useFactory: async () => {
        const file = await open('./encryption.key');
        const key = await file.readFile('utf-8');
        return new Uint8Array(Buffer.from(key, 'base64'));
      },
    },
    EncryptionService,
  ],
  exports: [EncryptionService],
})
export class EncryptionModuleModule {}
