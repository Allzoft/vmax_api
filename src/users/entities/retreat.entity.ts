import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { States } from './state.entity';
import { Users } from './user.entity';

@Entity()
export class Retreat {
  @PrimaryGeneratedColumn()
  id_retreat: number;

  @Column({ type: 'varchar', length: 255, default: '' })
  account_name: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  account_code: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  bank_name: string;

  @Column({ type: 'timestamp', nullable: false })
  retreat_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total_retreat: number;

  @Column({ type: 'int', nullable: false })
  stateIdState: number;

  @Column({ type: 'int', nullable: false })
  userIdUser: number;

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

  @ManyToOne(() => States, (state) => state.retreats)
  state: States;

  @ManyToOne(() => Users, (user) => user.retreats)
  user: Users;
}
