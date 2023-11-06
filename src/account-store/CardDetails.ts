import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import Account from './Account';

@Entity()
export class CardDetails {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Account, 'cardDetails')
  @JoinColumn()
  account: Account;

  @Column('text')
  cardNo: string;

  @Column('blob')
  initializationVectors: Uint8Array;

  @Column('text')
  cardType: string;
}
