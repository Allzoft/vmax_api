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
      order: { created_at: 'DESC' },
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

  async firstNotification(idUser: number, creditAmount: number) {
    const newNotification = new Notification();
    newNotification.color = '#6EE030';
    newNotification.tittle = 'Bono de registro añadido';
    newNotification.description = `Se le abono ${creditAmount} a su cuenta por su registro`;
    newNotification.icon = 'check-circle';
    newNotification.photo = 'welcom.png';
    newNotification.isRead = 0;
    newNotification.userIdUser = idUser;

    try {
      await this.notificationsRepository.save(newNotification);
    } catch (error) {
      console.error('Error al guardar la notificación:', error);
    }
  }
}
