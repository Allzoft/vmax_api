import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from './order.entity';
import { Retreat } from './retreat.entity';

export enum TypeState {
  ORDER = 'Order',
  RETREAT = 'Retreat',
  TRANSACTIONS = 'Transactions',
}

@Entity()
export class States {
  @PrimaryGeneratedColumn()
  id_state: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, default: 'Primary' })
  severity: string;

  @Column({ type: 'set', enum: TypeState, default: TypeState.ORDER })
  type: TypeState;

  @Column({ type: 'int', nullable: false, default: 1 })
  priority: number;

  @Column({ type: 'tinyint', default: 1, comment: '1: Active, 0:Delete' })
  status: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @OneToMany(() => Order, (order) => order.state)
  orders: Order[];

  @OneToMany(() => Retreat, (retreat) => retreat.state)
  retreats: Retreat[];
}
