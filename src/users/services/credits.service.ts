import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCreditDto } from '../dto/create-credit.dto';
import { UpdateCreditDto } from '../dto/update-credit.dto';

import { Credit, TypeCredit } from '../entities/credit.entity';
import { Notification } from '../entities/notification.entity';
import { Wallet } from '../entities/wallet.entity';
import { Users } from '../entities/user.entity';

@Injectable()
export class CreditsService {
  constructor(
    @InjectRepository(Credit)
    public creditsRepository: Repository<Credit>,

    @InjectRepository(Notification)
    public notificationsRepository: Repository<Notification>,

    @InjectRepository(Wallet)
    public walletsRepository: Repository<Wallet>,

    @InjectRepository(Users)
    public usersRepository: Repository<Users>,
  ) {}

  create(createCreditDto: CreateCreditDto) {
    const newCredit = this.creditsRepository.create(createCreditDto);
    return this.creditsRepository.save(newCredit);
  }

  async welcomeCredit(idWallet: number): Promise<number> {
    const newCredit = new Credit();
    newCredit.credit_amount = 2 + Math.random() * 0.5;
    newCredit.credit_date = new Date();
    newCredit.previous_amount = 0.0;
    newCredit.subsequent_amount = newCredit.credit_amount;
    newCredit.type_credit = TypeCredit.BONO;
    newCredit.walletIdWallet = idWallet;

    const saveCredit = await this.creditsRepository.save(newCredit);

    return saveCredit.credit_amount;
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

  async findByWallet(
    wallet: number,
    limit = 10,
    offset = 0,
  ): Promise<Credit[]> {
    const list = await this.creditsRepository.find({
      where: { status: 1, walletIdWallet: wallet },
      take: limit,
      skip: offset,
      order: { credit_date: 'DESC' },
    });

    if (!list.length) {
      throw new NotFoundException({ message: 'Lista vacía' });
    }

    return list;
  }

  async update(id: number, updateWorkerDto: UpdateCreditDto) {
    const item = await this.creditsRepository.findOneBy({
      id_credit: id,
    });
    this.creditsRepository.merge(item, updateWorkerDto);

    return this.creditsRepository.save(item);
  }

  async aproveFound(data: { creditId: number; idUser: number }) {
    const credit = await this.creditsRepository.findOne({
      where: { id_credit: data.creditId },
    });

    if (!credit) {
      throw new ConflictException('Error con el fondeo, intenta más tarde');
    }

    const user = await this.usersRepository.findOne({
      where: { id_user: data.idUser },
      relations: { wallet: true },
    });
    console.log(user);

    if (!user) {
      throw new ConflictException('Error con el usuario, intenta más tarde');
    }

    if (user.walletId !== credit.walletIdWallet) {
      throw new ConflictException(
        `Error, el fondeo ${credit.walletIdWallet} y el usuario ${user.id_user} con la wallet ${user.walletId} no coiciden, intenta más tarde`,
      );
    }

    if (credit.stateIdState !== 4) {
      throw new ConflictException(
        `Error con el estado del fondeo, contacte a soporte`,
      );
    }

    const wallet = user.wallet;

    credit.previous_amount = +wallet.balance;
    credit.stateIdState = 5;
    credit.subsequent_amount = +wallet.balance + +credit.credit_amount;

    await this.creditsRepository.save(credit);
    const vipNumber = `vip_${user.phaseIdPhase}_earnings`;

    wallet.balance = credit.subsequent_amount;
    wallet[vipNumber] = +wallet[vipNumber] + +credit.credit_amount;

    await this.walletsRepository.save(wallet);

    const newNotification = new Notification();
    newNotification.color = '#6EE030';
    newNotification.tittle = 'Fondeo de cuenta exitoso';
    newNotification.description = `El fondeo se completo exitosamente y se le adicionaron USD ${credit.credit_amount} a su cuenta - código ${credit.id_credit}`;
    newNotification.icon = 'check-circle';
    newNotification.isRead = 0;
    newNotification.photo = 'welcom.png';
    newNotification.userIdUser = user.id_user;

    return await this.notificationsRepository.save(newNotification);
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
