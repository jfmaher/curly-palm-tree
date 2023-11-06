import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import Account from './Account';

@Entity()
export class CardDetails {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Account)
  account: Account;

  @Column('text')
  cardNo: string;

  @Column('blob')
  initializationVectors: Blob;
}
