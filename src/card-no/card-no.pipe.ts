import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CardNoPipe implements PipeTransform {
  transform(value: any) {
    value.match(/\d{16}/);
    return value;
  }
}
