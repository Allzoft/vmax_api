import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { States } from './state.entity';
import { Users } from './user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id_order: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  stateIdState: number;

  @Column({ type: 'int', nullable: false })
  userIdUser: number;

  @Column({ type: 'varchar', length: 255, nullable: true, default: '' })
  photo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price_per_unit: number;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  commission: number;

  @Column({ type: 'timestamp', nullable: false })
  order_date: Date;

  @Column()
  @Generated('uuid')
  uuid: string;

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

  @ManyToOne(() => States, (state) => state.orders)
  state: States;

  @ManyToOne(() => Users, (user) => user.orders)
  user: Users;
}
