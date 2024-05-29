import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id_notification: number;

  @Column({ type: 'int', nullable: false })
  userIdUser: number;

  @Column({ type: 'tinyint', default: 0 })
  isRead: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  tittle: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  photo: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  icon: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  color: string;

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

  @ManyToOne(() => Users, (user) => user.notifications)
  user: Users;
}
