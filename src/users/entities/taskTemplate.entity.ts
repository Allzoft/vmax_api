import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Phase } from './phase.entity';

export enum TypeTask {
  SUBSCRIPCION = 'Subscripción',
  MONETARIA = 'Monetaria',
  RECOMENDACION = 'Recomendación',
  REGISTRATE = 'Registrate',
}

@Entity()
export class TaskTemplate {
  @PrimaryGeneratedColumn()
  id_task_template: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'set', enum: TypeTask, default: TypeTask.SUBSCRIPCION })
  type_task: TypeTask;

  @Column({ type: 'varchar', length: 255, nullable: true })
  task_link: string;

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

  @ManyToOne(() => Phase, (phase) => phase.taskTemplates)
  phase: Phase;
}
