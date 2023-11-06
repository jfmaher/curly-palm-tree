import { IsCreditCard, IsEnum, IsInt, IsString } from 'class-validator';
import { Type } from './account-store/CardDetails';

export default class NewAccountDto {
  @IsString()
  name: string;

  @IsString()
  accountIdentifier: string;

  @IsInt()
  limit: number;

  @IsCreditCard()
  cardNo: string;

  @IsEnum(Type)
  cardType: Type;
}
