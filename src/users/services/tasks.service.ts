import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateTaskDto } from '../dto/update-task.dto';

import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    public tasksRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto) {
    const newTask = this.tasksRepository.create(createTaskDto);
    return this.tasksRepository.save(newTask);
  }

  async findAll() {
    const list = await this.tasksRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findOne(id: number) {
    const item = await this.tasksRepository.findOne({
      where: { id_task: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This task #${id} not found`);
    }
    return item;
  }

  async update(id: number, updateWorkerDto: UpdateTaskDto) {
    const item = await this.tasksRepository.findOneBy({
      id_task: id,
    });
    this.tasksRepository.merge(item, updateWorkerDto);

    return this.tasksRepository.save(item);
  }

  async remove(id: number) {
    const item = await this.tasksRepository.findOneBy({
      id_task: id,
    });
    const deleteTask: UpdateTaskDto = {
      status: 0,
    };

    this.tasksRepository.merge(item, deleteTask);

    return this.tasksRepository.save(item);
  }
}
