import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Credit } from './credit.entity';
import { Retreat } from './retreat.entity';
import { Users } from './user.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id_wallet: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  balance: number;

  @Column({ type: 'varchar', length: 30, default: 'BOB' })
  currency: string;

  @Column({ type: 'tinyint', default: 1, comment: '1: active, 0: delete' })
  status: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  vip_1_earnings: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  vip_2_earnings: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  vip_3_earnings: number;

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

  @OneToOne(() => Users, (user) => user.wallet)
  user: Users;

  @OneToMany(() => Credit, (credit) => credit.wallet)
  credits: Credit[];

  @OneToMany(() => Retreat, (retreat) => retreat.wallet)
  retreats: Retreat[];
}
