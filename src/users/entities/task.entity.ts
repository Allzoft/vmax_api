import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TypeTask } from './taskTemplate.entity';
import { Phase } from './phase.entity';
import { Users } from './user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id_task: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'set', enum: TypeTask, default: TypeTask.SUBSCRIPCION })
  type_task: TypeTask;

  @Column({ type: 'varchar', length: 255, nullable: true })
  task_link: string;

  @Column({ type: 'int', nullable: false })
  phaseIdPhase: number;

  @Column({ type: 'int', nullable: false })
  userIdUser: number;

  @Column({ type: 'tinyint', default: 0, comment: '1: yes, 0: no' })
  is_completed: number;

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

  @ManyToOne(() => Phase, (phase) => phase.tasks)
  phase: Phase;

  @ManyToOne(() => Users, (user) => user.tasks)
  user: Users;
}
