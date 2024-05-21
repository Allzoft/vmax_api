import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Generated,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Phase } from './phase.entity';
import { Task } from './task.entity';
import { Wallet } from './wallet.entity';
import { Order } from './order.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 30, default: '+591' })
  code_country: string;

  @Column({ type: 'varchar', length: 36, nullable: false })
  phone: string;

  @Column({ nullable: true, type: 'varchar', length: 100, default: '' })
  photo: string;

  @Column({ type: 'tinyint', default: 1, comment: '1: enabled, 0: disabled' })
  isEnabled: number;

  @Column({ type: 'int', nullable: false })
  phaseIdPhase: number;

  @Column({ type: 'int', nullable: false })
  walletId: number;

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

  @ManyToOne(() => Phase, (phase) => phase.users)
  phase: Phase;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToOne(() => Wallet)
  @JoinColumn()
  wallet: Wallet;
}
