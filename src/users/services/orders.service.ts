import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateOrderDto } from '../dto/update-order.dto';

import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    public ordersRepository: Repository<Order>,
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
