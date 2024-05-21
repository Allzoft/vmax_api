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
import { Wallet } from './entities/wallet.entity';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './services/wallets.service';
import { States } from './entities/state.entity';
import { StatesController } from './states.controller';
import { StatesService } from './services/states.service';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './services/orders.service';
import { Retreat } from './entities/retreat.entity';
import { RetreatsController } from './retreats.controller';
import { RetreatsService } from './services/retreats.service';
import { Credit } from './entities/credit.entity';
import { CreditsController } from './credits.controller';
import { CreditsService } from './services/credits.service';
import { OrderTemplatesController } from './orderTemplates.controller';
import { OrderTemplate } from './entities/orderTemplate.entity';
import { OrderTemplatesService } from './services/orderTemplates.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Phase,
      TaskTemplate,
      Task,
      Wallet,
      States,
      Order,
      Retreat,
      Credit,
      OrderTemplate,
    ]),
  ],
  controllers: [
    UsersController,
    PhasesController,
    TaskTemplatesController,
    TasksController,
    WalletsController,
    StatesController,
    OrdersController,
    RetreatsController,
    CreditsController,
    OrderTemplatesController,
  ],
  providers: [
    UsersService,
    PhasesService,
    TaskTemplatesService,
    TasksService,
    WalletsService,
    StatesService,
    OrdersService,
    RetreatsService,
    CreditsService,
    OrderTemplatesService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
