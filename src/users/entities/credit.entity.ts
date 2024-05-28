import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';

export enum TypeCredit {
  BONO = 'Bono de registro',
  BONO_DE_AFILIADO = 'Bono de afiliado',
  CUPON = 'Cupon',
  BONO_DE_USUARIO_VIP = 'Bono de usuario VIP',
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
  walletIdWallet: number;

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

  @ManyToOne(() => Wallet, (wallet) => wallet.credits)
  wallet: Wallet;
}
