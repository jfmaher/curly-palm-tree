import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class Account {
  @PrimaryColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  accountIdentifier: string;

  @Column('int')
  limit: number;

  @Column('int')
  balance: number;
}
