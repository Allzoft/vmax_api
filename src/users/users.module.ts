import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { Phase } from './entities/phase.entity';
import { PhasesController } from './phases.controller';
import { PhasesService } from './services/phases.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Phase])],
  controllers: [UsersController, PhasesController],
  providers: [UsersService, PhasesService],
  exports: [UsersService],
})
export class UsersModule {}
