import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CardNoPipe implements PipeTransform {
  transform(value: string) {
    if (value.match(/^\d{16}$/) === null)
      throw new Error('card number format wrong');
    return value;
  }
}
