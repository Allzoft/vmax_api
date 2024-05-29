import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { OrderTemplate } from './orderTemplate.entity';
import { Order } from './order.entity';

@Entity()
export class Phase {
  @PrimaryGeneratedColumn()
  id_phase: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  task_number: number;

  @Column({ type: 'int', nullable: false })
  level: number;

  @Column({ type: 'tinyint', default: 1, comment: '1: active, 0: delete' })
  status: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  updated_at: Date;

  @OneToMany(() => Users, (user) => user.phase)
  users: Users[];

  @OneToMany(() => OrderTemplate, (orderTemplate) => orderTemplate.phase)
  orderTemplates: OrderTemplate[];

  @OneToMany(() => Order, (order) => order.phase)
  orders: Order[];
}
