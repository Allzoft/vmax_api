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

@Module({
  imports: [TypeOrmModule.forFeature([Users, Phase, TaskTemplate])],
  controllers: [UsersController, PhasesController, TaskTemplatesController],
  providers: [UsersService, PhasesService, TaskTemplatesService],
  exports: [UsersService],
})
export class UsersModule {}
