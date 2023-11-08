import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  algorithm = 'aes256';
  constructor(@Inject('KEY') private readonly key: Uint8Array) {
    debugger;
  }
  encrypt(str: string) {
    const iv = crypto.randomFillSync(new Uint8Array(16));
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encryption = cipher.update(str, 'utf-8', 'base64');
    encryption += cipher.final('base64');
    return { iv, encryption };
  }
  decrypt(iv: Uint8Array, str: string) {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let deciphered = decipher.update(str, 'base64', 'utf-8');
    deciphered += decipher.final('utf-8');
    return deciphered;
  }
}
