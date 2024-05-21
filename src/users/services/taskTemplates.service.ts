import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTaskTemplateDto } from '../dto/create-taskTemplate.dto';
import { UpdateTaskTemplateDto } from '../dto/update-taskTemplate.dto';

import { TaskTemplate } from '../entities/taskTemplate.entity';

@Injectable()
export class TaskTemplatesService {
  constructor(
    @InjectRepository(TaskTemplate)
    public taskTemplatesRepository: Repository<TaskTemplate>,
  ) {}

  create(createTaskTemplateDto: CreateTaskTemplateDto) {
    const newTaskTemplate = this.taskTemplatesRepository.create(
      createTaskTemplateDto,
    );
    return this.taskTemplatesRepository.save(newTaskTemplate);
  }

  async findAll() {
    const list = await this.taskTemplatesRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findOne(id: number) {
    const item = await this.taskTemplatesRepository.findOne({
      where: { id_task_template: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This taskTemplate #${id} not found`);
    }
    return item;
  }

  async update(id: number, updateWorkerDto: UpdateTaskTemplateDto) {
    const item = await this.taskTemplatesRepository.findOneBy({
      id_task_template: id,
    });
    this.taskTemplatesRepository.merge(item, updateWorkerDto);

    return this.taskTemplatesRepository.save(item);
  }

  async remove(id: number) {
    const item = await this.taskTemplatesRepository.findOneBy({
      id_task_template: id,
    });
    const deleteTaskTemplate: UpdateTaskTemplateDto = {
      status: 0,
    };

    this.taskTemplatesRepository.merge(item, deleteTaskTemplate);

    return this.taskTemplatesRepository.save(item);
  }
}
