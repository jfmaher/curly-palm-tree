import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentGatewayService {
  async payment(): Promise<any> {}
}