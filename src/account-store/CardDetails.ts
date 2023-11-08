import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Account from './Account';

@Entity()
export class CardDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Account, 'cardDetails')
  @JoinColumn()
  account?: Account;

  @Column('text')
  cardholderName: string;

  @Column('text')
  cardNo: string;

  @Column('blob')
  initializationVectors: Uint8Array;

  @Column('text')
  cardType: Type;

  @Column('text')
  hash: string;
}

export enum Type {
  MASTERCARD = 'MASTERCARD',
  VISA = 'VISA',
}
