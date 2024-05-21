import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { Phase } from './entities/phase.entity';
import { PhasesController } from './phases.controller';
import { PhasesService } from './services/phases.service';
import { TaskTemplate } from './entities/taskTemplate.entity';
import { TaskTemplatesController } from './taskTemplates.controller';
import { TaskTemplatesService } from './services/taskTemplates.service';
import { Task } from './entities/task.entity';
import { TasksService } from './services/tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Phase, TaskTemplate, Task])],
  controllers: [
    UsersController,
    PhasesController,
    TaskTemplatesController,
    TasksController,
  ],
  providers: [UsersService, PhasesService, TaskTemplatesService, TasksService],
  exports: [UsersService],
})
export class UsersModule {}
