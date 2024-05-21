import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Phase } from './phase.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

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
}
