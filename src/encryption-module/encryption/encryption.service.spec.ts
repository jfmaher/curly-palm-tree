import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'KEY',
          useValue: new Uint8Array([
            131, 37, 49, 83, 137, 153, 63, 58, 38, 242, 73, 146, 134, 225, 33,
            179, 84, 51, 20, 21, 93, 52, 176, 48, 21, 249, 175, 11, 223, 162,
            221, 251,
          ]),
        },
        EncryptionService,
      ],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should encrypt and decrypt', () => {
    const { iv, encryption } = service.encrypt('helloabcdefghijkkk');

    console.log(encryption);

    expect(service.decrypt(iv, encryption)).toEqual('helloabcdefghijkkk');
  });
});
