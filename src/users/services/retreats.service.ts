import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateRetreatDto } from '../dto/update-retreat.dto';
import { CreateRetreatDto } from '../dto/create-retreat.dto';

import { Retreat } from '../entities/retreat.entity';

@Injectable()
export class RetreatsService {
  constructor(
    @InjectRepository(Retreat)
    public retreatsRepository: Repository<Retreat>,
  ) {}

  create(createRetreatDto: CreateRetreatDto) {
    const newRetreat = this.retreatsRepository.create(createRetreatDto);
    return this.retreatsRepository.save(newRetreat);
  }

  async findAll() {
    const list = await this.retreatsRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findOne(id: number) {
    const item = await this.retreatsRepository.findOne({
      where: { id_retreat: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This retreat #${id} not found`);
    }
    return item;
  }

  async update(id: number, updateWorkerDto: UpdateRetreatDto) {
    const item = await this.retreatsRepository.findOneBy({
      id_retreat: id,
    });
    this.retreatsRepository.merge(item, updateWorkerDto);

    return this.retreatsRepository.save(item);
  }

  async remove(id: number) {
    const item = await this.retreatsRepository.findOneBy({
      id_retreat: id,
    });
    const deleteRetreat: UpdateRetreatDto = {
      status: 0,
    };

    this.retreatsRepository.merge(item, deleteRetreat);

    return this.retreatsRepository.save(item);
  }
}
