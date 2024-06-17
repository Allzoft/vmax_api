import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateRetreatDto } from '../dto/update-retreat.dto';
import { CreateRetreatDto } from '../dto/create-retreat.dto';

import { Retreat } from '../entities/retreat.entity';
import { Wallet } from '../entities/wallet.entity';
import { Notification } from '../entities/notification.entity';
import { Users } from '../entities/user.entity';

@Injectable()
export class RetreatsService {
  constructor(
    @InjectRepository(Retreat)
    public retreatsRepository: Repository<Retreat>,

    @InjectRepository(Wallet)
    public walletRepository: Repository<Wallet>,

    @InjectRepository(Users)
    public usersRepository: Repository<Users>,

    @InjectRepository(Notification)
    public notificationsRepository: Repository<Notification>,
  ) {}

  async create(createRetreatDto: CreateRetreatDto) {
    const wallet = await this.walletRepository.findOne({
      where: { id_wallet: createRetreatDto.walletIdWallet },
    });

    if (!wallet) {
      throw new ConflictException('Error con la billetera, intenta más tarde');
    }

    if (wallet.balance < +createRetreatDto.total_retreat) {
      throw new ConflictException(
        'El monto de retiro no puedo exceder el balance de la billetera',
      );
    }

    wallet.balance = +wallet.balance - +createRetreatDto.total_retreat;

    const saveWallet = await this.walletRepository.save(wallet);

    const newRetreat = await this.retreatsRepository.create(createRetreatDto);
    const saveRetreat = await this.retreatsRepository.save(newRetreat);

    return {
      retreat: saveRetreat,
      wallet: saveWallet,
    };
  }

  async findAll() {
    const list = await this.retreatsRepository.find({
      where: { status: 1 },
      relations: { state: true, wallet: true },
      order: { retreat_date: 'DESC' },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findByWallet(
    wallet: number,
    limit = 10,
    offset = 0,
  ): Promise<Retreat[]> {
    const list = await this.retreatsRepository.find({
      where: { status: 1, walletIdWallet: wallet },
      take: limit,
      skip: offset,
      order: { retreat_date: 'DESC' },
    });

    if (!list.length) {
      throw new NotFoundException({ message: 'Lista vacía' });
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

  async update(id: number, updateRetreatDto: UpdateRetreatDto) {
    const item = await this.retreatsRepository.findOneBy({
      id_retreat: id,
    });
    this.retreatsRepository.merge(item, updateRetreatDto);

    const user = await this.usersRepository.findOne({
      where: { walletId: item.walletIdWallet },
    });

    if (item.stateIdState === 7) {
      const newNotification = new Notification();
      newNotification.color = '#2984F1';
      newNotification.tittle = 'Retirado en proceso';
      newNotification.description = `Su retiro ya se encuentra en proceso, este proceso no deberia tardar más de 24 horas`;
      newNotification.icon = 'info-circle';
      newNotification.isRead = 0;
      newNotification.photo = 'retreat.svg';
      newNotification.userIdUser = user.id_user;

      await this.notificationsRepository.save(newNotification);
    }

    if (item.stateIdState === 8) {
      const newNotification = new Notification();
      newNotification.color = '#6EE030';
      newNotification.tittle = 'Retiro exitoso';
      newNotification.description = `Su retiro se completo exitosamente`;
      newNotification.icon = 'check-circle';
      newNotification.isRead = 0;
      newNotification.photo = 'retreat.svg';
      newNotification.userIdUser = user.id_user;

      await this.notificationsRepository.save(newNotification);
    }

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
