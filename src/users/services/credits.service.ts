import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCreditDto } from '../dto/create-credit.dto';
import { UpdateCreditDto } from '../dto/update-credit.dto';

import { Credit } from '../entities/credit.entity';

@Injectable()
export class CreditsService {
  constructor(
    @InjectRepository(Credit)
    public creditsRepository: Repository<Credit>,
  ) {}

  create(createCreditDto: CreateCreditDto) {
    const newCredit = this.creditsRepository.create(createCreditDto);
    return this.creditsRepository.save(newCredit);
  }

  async findAll() {
    const list = await this.creditsRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findOne(id: number) {
    const item = await this.creditsRepository.findOne({
      where: { id_credit: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This credit #${id} not found`);
    }
    return item;
  }

  async update(id: number, updateWorkerDto: UpdateCreditDto) {
    const item = await this.creditsRepository.findOneBy({
      id_credit: id,
    });
    this.creditsRepository.merge(item, updateWorkerDto);

    return this.creditsRepository.save(item);
  }

  async remove(id: number) {
    const item = await this.creditsRepository.findOneBy({
      id_credit: id,
    });
    const deleteCredit: UpdateCreditDto = {
      status: 0,
    };

    this.creditsRepository.merge(item, deleteCredit);

    return this.creditsRepository.save(item);
  }
}
