import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrderTemplateDto } from '../dto/create-orderTemplate.dto';
import { UpdateOrderTemplateDto } from '../dto/update-orderTemplate.dto';

import { OrderTemplate } from '../entities/orderTemplate.entity';

@Injectable()
export class OrderTemplatesService {
  constructor(
    @InjectRepository(OrderTemplate)
    public orderTemplatesRepository: Repository<OrderTemplate>,
  ) {}

  create(createOrderTemplateDto: CreateOrderTemplateDto) {
    const newOrderTemplate = this.orderTemplatesRepository.create(
      createOrderTemplateDto,
    );
    return this.orderTemplatesRepository.save(newOrderTemplate);
  }

  async findAll() {
    const list = await this.orderTemplatesRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findOne(id: number) {
    const item = await this.orderTemplatesRepository.findOne({
      where: { id_order_template: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This orderTemplate #${id} not found`);
    }
    return item;
  }

  async update(id: number, updateWorkerDto: UpdateOrderTemplateDto) {
    const item = await this.orderTemplatesRepository.findOneBy({
      id_order_template: id,
    });
    this.orderTemplatesRepository.merge(item, updateWorkerDto);

    return this.orderTemplatesRepository.save(item);
  }

  async remove(id: number) {
    const item = await this.orderTemplatesRepository.findOneBy({
      id_order_template: id,
    });
    const deleteOrderTemplate: UpdateOrderTemplateDto = {
      status: 0,
    };

    this.orderTemplatesRepository.merge(item, deleteOrderTemplate);

    return this.orderTemplatesRepository.save(item);
  }
}
