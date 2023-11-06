import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { CardDetails } from './CardDetails';

@Entity()
export default class Account {
  @PrimaryColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('int')
  limit: number;

  @Column('int')
  balance: number;

  @OneToOne(() => CardDetails, 'account', { cascade: true })
  cardDetails: CardDetails;
}
