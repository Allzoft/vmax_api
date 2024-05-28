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
    });

    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async fitsOrderByUser(idUser: number) {
    const orderTemplates = await this.orderTemplatesRepository.find({
      where: { phaseIdPhase: 1 },
    });

    const randomIndex = Math.floor(Math.random() * orderTemplates.length);

    const randomTemplate = orderTemplates[randomIndex];

    const newOrder = new Order();

    newOrder.name = randomTemplate.name;
    newOrder.quantity = randomTemplate.quantity;
    newOrder.photo = randomTemplate.photo;
    newOrder.total_price = randomTemplate.total_price;
    newOrder.userIdUser = idUser;
  }

  async sendFounsOrder(dataFound: { idUser: number; idOrder: number }) {
    const order = await this.ordersRepository.findOne({
      where: { id_order: dataFound.idOrder },
    });

    const user = await this.usersRepository.findOne({
      where: { id_user: dataFound.idUser },
      relations: { wallet: true },
    });

    if (!user) {
      throw new ConflictException('Error con el usuario, intenta más tarde');
    }

    if (!order) {
      throw new ConflictException('Error con la orden, intenta más tarde');
    }

    const wallet = { ...user.wallet };

    if (+wallet.balance < +order.total_price) {
      const difference = order.total_price - wallet.balance;
      throw new ConflictException(
        `Fondos insuficientes. Recarga $${difference} para completar la diferencia`,
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

    return {
      wallet: updatedWallet,
      order: updatedOrder,
    };
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
}
