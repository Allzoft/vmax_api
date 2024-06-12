import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { Phase } from './entities/phase.entity';
import { PhasesController } from './phases.controller';
import { PhasesService } from './services/phases.service';
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
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './services/notifications.service';
import { Notification } from './entities/notification.entity';
import { Affiliate } from './entities/affilate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Phase,
      Wallet,
      States,
      Order,
      Retreat,
      Credit,
      OrderTemplate,
      Notification,
      Affiliate,
    ]),
  ],
  controllers: [
    UsersController,
    PhasesController,
    WalletsController,
    StatesController,
    OrdersController,
    RetreatsController,
    CreditsController,
    OrderTemplatesController,
    NotificationsController,
  ],
  providers: [
    UsersService,
    PhasesService,
    WalletsService,
    StatesService,
    OrdersService,
    RetreatsService,
    CreditsService,
    OrderTemplatesService,
    NotificationsService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
