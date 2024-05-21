import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './user.entity';

export enum TypeCredit {
  COBRO_DE_COMISION = 'Cobro de comisión',
  RECARGA = 'Recarga',
}

@Entity()
export class Credit {
  @PrimaryGeneratedColumn()
  id_credit: number;

  @Column({
    type: 'set',
    enum: TypeCredit,
    default: TypeCredit.COBRO_DE_COMISION,
  })
  type_credit: TypeCredit;

  @Column({ type: 'int', nullable: false })
  userIdUser: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  previous_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  credit_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  subsequent_amount: number;

  @Column({ type: 'timestamp', nullable: false })
  credit_date: Date;

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

  @ManyToOne(() => Users, (user) => user.credits)
  user: Users;
}
