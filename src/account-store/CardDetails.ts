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
  cardNo: string;

  @Column('blob')
  initializationVectors: Uint8Array;

  @Column('text')
  cardType: Type;
}

export enum Type {
  MASTERCARD = 'MASTERCARD',
  VISA = 'VISA',
}
