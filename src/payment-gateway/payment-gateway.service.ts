import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentGatewayService {
  async payment(...args: any[]): Promise<any> {}
}
