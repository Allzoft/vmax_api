import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Credit } from './credit.entity';

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

  @OneToMany(() => Credit, (credit) => credit.wallet)
  credits: Credit[];
}
