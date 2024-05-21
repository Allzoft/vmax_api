import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStateDto } from '../dto/create-state.dto';
import { UpdateStateDto } from '../dto/update-state.dto';
import { States, TypeState } from '../entities/state.entity';

@Injectable()
export class StatesService {
  constructor(
    @InjectRepository(States)
    public statusRepository: Repository<States>,
  ) {}

  async create(createStatesDto: CreateStateDto) {
    const newState = this.statusRepository.create(createStatesDto);
    const savedState = await this.statusRepository.save(newState);

    return savedState;
  }

  async findAll() {
    const list = await this.statusRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findAllByType(type: TypeState) {
    const list = await this.statusRepository.find({
      where: { type: type, status: 1 },
      order: {
        priority: 'ASC',
      },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'empty states by type list ' });
    }
    return list;
  }

  async findOne(id: number) {
    const item = await this.statusRepository.findOne({
      where: { id_state: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This state #${id} not found`);
    }
    return item;
  }

  async update(id: number, changes: UpdateStateDto) {
    const item = await this.statusRepository.findOneBy({
      id_state: id,
      status: 1,
    });
    this.statusRepository.merge(item, changes);

    const savedState = await this.statusRepository.save(item);

    return savedState;
  }

  async remove(id: number) {
    const item = await this.statusRepository.findOneBy({ id_state: id });
    const deleteStates: UpdateStateDto = {
      status: 0,
    };

    this.statusRepository.merge(item, deleteStates);

    const savedState = await this.statusRepository.save(item);

    return savedState;
  }
}
