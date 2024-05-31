import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateOrderDto } from '../dto/update-order.dto';

import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';
import { Users } from '../entities/user.entity';
import { Wallet } from '../entities/wallet.entity';
import { States } from '../entities/state.entity';
import { OrderTemplate } from '../entities/orderTemplate.entity';
import { Credit, TypeCredit } from '../entities/credit.entity';
import { Notification } from '../entities/notification.entity';

export interface DataOrder {
  idUser: number;
  idOrder: number;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    public ordersRepository: Repository<Order>,

    @InjectRepository(OrderTemplate)
    public orderTemplatesRepository: Repository<OrderTemplate>,

    @InjectRepository(Users)
    private usersRepository: Repository<Users>,

    @InjectRepository(Wallet)
    private walletsRepository: Repository<Wallet>,

    @InjectRepository(States)
    private statesRepository: Repository<States>,

    @InjectRepository(Credit)
    private creditsRepository: Repository<Credit>,

    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    const newOrder = this.ordersRepository.create(createOrderDto);
    return this.ordersRepository.save(newOrder);
  }

  async findAll() {
    const list = await this.ordersRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findAllByUser(id: number) {
    const list = await this.ordersRepository.find({
      where: { status: 1, userIdUser: id },
      relations: { user: true, state: true },
      order: { order_date: 'DESC' },
    });

    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async firtsOrderByUser(idUser: number) {
    const orderTemplates = await this.orderTemplatesRepository.find({
      where: { phaseIdPhase: 1 },
    });

    const state = await this.statesRepository.findOne({
      where: { id_state: 1 },
    });

    const randomIndex = Math.floor(Math.random() * orderTemplates.length);

    const randomTemplate = orderTemplates[randomIndex];
    const randomPricePerUnit = this.getRandomWithinRange(
      +randomTemplate.price_per_unit,
      0.1,
    );

    const newOrder = new Order();

    newOrder.userIdUser = idUser;
    newOrder.name = randomTemplate.name;
    newOrder.state = state;
    newOrder.stateIdState = 1;
    newOrder.order_date = new Date();
    newOrder.photo = randomTemplate.photo;
    newOrder.price_per_unit = parseFloat(randomPricePerUnit.toFixed(2));
    newOrder.category = randomTemplate.category;
    newOrder.quantity = randomTemplate.quantity;
    newOrder.commission = +randomTemplate.commission;
    newOrder.total_price = +newOrder.price_per_unit * newOrder.quantity;
    newOrder.phaseIdPhase = 1;

    return await this.ordersRepository.save(newOrder);
  }

  async sendFounsOrder(dataOrder: DataOrder) {
    const order = await this.ordersRepository.findOne({
      where: { id_order: dataOrder.idOrder },
    });

    const user = await this.usersRepository.findOne({
      where: { id_user: dataOrder.idUser },
      relations: { wallet: true },
    });

    if (!user) {
      throw new ConflictException('Error con el usuario, intenta más tarde');
    }

    if (!order) {
      throw new ConflictException('Error con la orden, intenta más tarde');
    }

    if (user.id_user !== order.userIdUser) {
      throw new ConflictException(
        'Error, la orden y el usuario no coiciden, intenta más tarde',
      );
    }

    if (order.stateIdState !== 1) {
      throw new ConflictException('Error, con el estado de la orden');
    }

    const wallet = { ...user.wallet };

    if (+wallet.balance < +order.total_price) {
      const difference = order.total_price - wallet.balance;
      throw new ConflictException(
        `Fondos insuficientes. Recarga $${difference.toFixed(2)} para completar la diferencia`,
      );
    }

    wallet.balance -= order.total_price;
    const updatedWallet = await this.walletsRepository.save(wallet);

    const state = await this.statesRepository.findOne({
      where: { id_state: 2 },
    });

    order.stateIdState = 2;
    order.state = state;
    const updatedOrder = await this.ordersRepository.save(order);

    const newNotification = new Notification();
    newNotification.color = '#2984F1';
    newNotification.tittle = 'Fondos enviados con exito';
    newNotification.description = `La orden ${order.id_order} ha recibido los fondos exitosamente`;
    newNotification.icon = 'info-circle';
    newNotification.isRead = 0;
    newNotification.photo = order.photo;
    newNotification.userIdUser = user.id_user;

    const saveNotification =
      await this.notificationsRepository.save(newNotification);

    return {
      notification: saveNotification,
      wallet: updatedWallet,
      order: updatedOrder,
    };
  }

  async confirmationOrder(dataOrder: DataOrder) {
    const order = await this.ordersRepository.findOne({
      where: { id_order: dataOrder.idOrder },
    });

    const user = await this.usersRepository.findOne({
      where: { id_user: dataOrder.idUser },
      relations: { wallet: true, phase: true },
    });

    if (!user) {
      throw new ConflictException('Error con el usuario, intenta más tarde');
    }

    if (!order) {
      throw new ConflictException('Error con la orden, intenta más tarde');
    }

    if (user.id_user !== order.userIdUser) {
      throw new ConflictException(
        'Error, la orden y el usuario no coiciden, intenta más tarde',
      );
    }

    if (order.stateIdState !== 2) {
      throw new ConflictException('Error, con el estado de la orden');
    }

    const wallet = { ...user.wallet };

    const previousMount = wallet.balance;

    wallet.balance = +wallet.balance + +order.total_price + +order.commission;

    await this.walletsRepository.save(wallet);

    const newCredit = new Credit();
    newCredit.walletIdWallet = user.walletId;
    newCredit.credit_date = new Date();
    newCredit.type_credit = TypeCredit.COBRO_DE_COMISION;
    newCredit.previous_amount = +previousMount;
    newCredit.subsequent_amount = +wallet.balance;
    newCredit.stateIdState = 5;
    newCredit.credit_amount = +order.total_price + +order.commission;

    await this.creditsRepository.save(newCredit);

    const state = await this.statesRepository.findOne({
      where: { id_state: 3 },
    });

    order.stateIdState = 3;
    order.state = state;
    const updatedOrder = await this.ordersRepository.save(order);

    const newOrder = await this.createOrderByPayedPreviousOrder(user);

    const newNotification = new Notification();
    newNotification.color = '#6EE030';
    newNotification.tittle = 'Pedido completado';
    newNotification.description = `La orden ${order.id_order} ha sido completada y las ganancias correspondientes han sido acreditadas en tu cuenta.`;
    newNotification.icon = 'check-circle';
    newNotification.photo = order.photo;
    newNotification.isRead = 0;
    newNotification.userIdUser = user.id_user;

    await this.notificationsRepository.save(newNotification);

    return {
      user,
      order: updatedOrder,
      newOrder: newOrder,
    };
  }

  async createOrderByPayedPreviousOrder(user: Users): Promise<Order> {
    console.log(user);

    const ordersUser = await this.ordersRepository.find({
      where: { phaseIdPhase: user.phaseIdPhase, userIdUser: user.id_user },
    });

    const ordersCompleted = ordersUser.filter(
      (order) => order.stateIdState === 3,
    );

    const taskNumber = user.phase.task_number;
    const nextPhaseId =
      ordersCompleted.length === taskNumber
        ? user.phaseIdPhase + 1
        : user.phaseIdPhase;

    console.log('OrdersComplete: ', ordersCompleted.length);
    console.log(taskNumber);

    console.log('phaseID:', user.phaseIdPhase);
    console.log('phaseID+:', nextPhaseId);

    const ordersTemplate = await this.orderTemplatesRepository.find({
      where: { phaseIdPhase: nextPhaseId },
    });

    const filteredOrdersTemplate =
      nextPhaseId === user.phaseIdPhase
        ? ordersTemplate.filter(
            (template) =>
              !ordersUser.map((order) => order.name).includes(template.name),
          )
        : ordersTemplate;

    console.log('--------------------------', filteredOrdersTemplate);

    const randomTemplate = this.getRandomElement(filteredOrdersTemplate);

    const randomPricePerUnit = this.getRandomWithinRange(
      +randomTemplate.price_per_unit,
      0.1,
    );

    return this.createAndSaveOrder(
      user,
      randomTemplate,
      randomPricePerUnit,
      nextPhaseId,
    );
  }

  async findOne(id: number) {
    const item = await this.ordersRepository.findOne({
      where: { id_order: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This order #${id} not found`);
    }
    return item;
  }

  async update(id: number, updateWorkerDto: UpdateOrderDto) {
    const item = await this.ordersRepository.findOneBy({
      id_order: id,
    });
    this.ordersRepository.merge(item, updateWorkerDto);

    return this.ordersRepository.save(item);
  }

  async remove(id: number) {
    const item = await this.ordersRepository.findOneBy({
      id_order: id,
    });
    const deleteOrder: UpdateOrderDto = {
      status: 0,
    };

    this.ordersRepository.merge(item, deleteOrder);

    return this.ordersRepository.save(item);
  }

  private getRandomWithinRange(value: number, percentage: number): number {
    const min = value - value * percentage;
    const max = value + value * percentage;
    return Math.random() * (max - min) + min;
  }

  private getRandomElement<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  async createAndSaveOrder(
    user: Users,
    template: OrderTemplate,
    pricePerUnit: number,
    phaseId: number,
  ): Promise<Order> {
    console.log(user);
    console.log(template);
    console.log(pricePerUnit);
    console.log(phaseId);

    const newOrder = new Order();

    newOrder.userIdUser = user.id_user;
    newOrder.name = template.name;
    newOrder.stateIdState = 1;
    newOrder.photo = template.photo;
    newOrder.price_per_unit = parseFloat(pricePerUnit.toFixed(2));
    newOrder.category = template.category;
    newOrder.quantity = template.quantity;
    newOrder.commission = template.commission;
    newOrder.total_price = +newOrder.price_per_unit * +newOrder.quantity;
    newOrder.phaseIdPhase = phaseId;
    newOrder.order_date = new Date();

    return await this.ordersRepository.save(newOrder);
  }
}
