import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    public notificationsRepository: Repository<Notification>,
  ) {}

  create(createNotificationDto: CreateNotificationDto) {
    const newNotification = this.notificationsRepository.create(
      createNotificationDto,
    );
    return this.notificationsRepository.save(newNotification);
  }

  async findAll() {
    const list = await this.notificationsRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findByUser(
    userId: number,
    limit = 10,
    offset = 0,
  ): Promise<Notification[]> {
    const list = await this.notificationsRepository.find({
      where: { status: 1, userIdUser: userId },
      take: limit,
      skip: offset,
    });

    if (!list.length) {
      throw new NotFoundException({ message: 'Lista vacía' });
    }

    return list;
  }

  async findOne(id: number) {
    const item = await this.notificationsRepository.findOne({
      where: { id_notification: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This notification #${id} not found`);
    }
    return item;
  }

  async update(id: number, updateWorkerDto: UpdateNotificationDto) {
    const item = await this.notificationsRepository.findOneBy({
      id_notification: id,
    });
    this.notificationsRepository.merge(item, updateWorkerDto);

    return this.notificationsRepository.save(item);
  }

  async remove(id: number) {
    const item = await this.notificationsRepository.findOneBy({
      id_notification: id,
    });
    const deleteNotification: UpdateNotificationDto = {
      status: 0,
    };

    this.notificationsRepository.merge(item, deleteNotification);

    return this.notificationsRepository.save(item);
  }
}
