import {
  IsCreditCard,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';
import { Type } from './account-store/CardDetails';

export default class NewAccountDto {
  @IsString()
  accountIdentifier: string;

  @IsInt()
  @Min(0)
  limit: number;

  @IsString()
  @IsNotEmpty()
  cardholderName: string;

  @IsCreditCard()
  @IsNotEmpty()
  cardNo: string;

  @IsEnum(Type)
  cardType: Type;
}
