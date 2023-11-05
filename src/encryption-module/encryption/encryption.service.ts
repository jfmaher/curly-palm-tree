import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  algorithm = 'aes256';
  key = new Uint8Array([
    131, 37, 49, 83, 137, 153, 63, 58, 38, 242, 73, 146, 134, 225, 33, 179, 84,
    51, 20, 21, 93, 52, 176, 48, 21, 249, 175, 11, 223, 162, 221, 251,
  ]);
  constructor() {}
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
