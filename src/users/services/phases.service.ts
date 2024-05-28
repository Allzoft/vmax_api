import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePhaseDto } from '../dto/create-phase.dto';
import { UpdatePhaseDto } from '../dto/update-phase.dto';

import { Phase } from '../entities/phase.entity';

@Injectable()
export class PhasesService {
  constructor(
    @InjectRepository(Phase)
    public phasesRepository: Repository<Phase>,
  ) {}

  async create(createPhaseDto: CreatePhaseDto) {
    const newPhase = this.phasesRepository.create(createPhaseDto);
    return await this.phasesRepository.save(newPhase);
  }

  async findAll() {
    const list = await this.phasesRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findOne(id: number) {
    const item = await this.phasesRepository.findOne({
      where: { id_phase: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This phase #${id} not found`);
    }
    return item;
  }

  async update(id: number, updateWorkerDto: UpdatePhaseDto) {
    const item = await this.phasesRepository.findOneBy({
      id_phase: id,
    });
    this.phasesRepository.merge(item, updateWorkerDto);

    return this.phasesRepository.save(item);
  }

  async remove(id: number) {
    const item = await this.phasesRepository.findOneBy({
      id_phase: id,
    });
    const deletePhase: UpdatePhaseDto = {
      status: 0,
    };

    this.phasesRepository.merge(item, deletePhase);

    return this.phasesRepository.save(item);
  }
}
