import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Phase } from './phase.entity';

@Entity()
export class OrderTemplate {
  @PrimaryGeneratedColumn()
  id_order_template: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  phaseIdPhase: number;

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

  @ManyToOne(() => Phase, (phase) => phase.orderTemplates)
  phase: Phase;
}
