import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';

import { Wallet } from '../entities/wallet.entity';
import { CreditsService } from './credits.service';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    public walletsRepository: Repository<Wallet>,

    private creditsService: CreditsService,
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    const newWallet = this.walletsRepository.create(createWalletDto);
    return await this.walletsRepository.save(newWallet);
  }

  async createWalletNewUser(): Promise<Wallet> {
    const newWallet = new Wallet();
    newWallet.currency = 'USD';
    newWallet.balance = 0.0;

    try {
      const saveWallet = await this.walletsRepository.save(newWallet);

      const bonusAmount = await this.creditsService.welcomeCredit(
        saveWallet.id_wallet,
      );

      saveWallet.vip_1_earnings = bonusAmount;
      saveWallet.balance = bonusAmount;

      await this.walletsRepository.save(saveWallet);

      return saveWallet;
    } catch (error) {
      throw new Error('Unable to create new wallet');
    }
  }

  async findAll() {
    const list = await this.walletsRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findOne(id: number) {
    const item = await this.walletsRepository.findOne({
      where: { id_wallet: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This wallet #${id} not found`);
    }
    return item;
  }

  async update(id: number, updateWorkerDto: UpdateWalletDto) {
    const item = await this.walletsRepository.findOneBy({
      id_wallet: id,
    });
    this.walletsRepository.merge(item, updateWorkerDto);

    return this.walletsRepository.save(item);
  }

  async remove(id: number) {
    const item = await this.walletsRepository.findOneBy({
      id_wallet: id,
    });
    const deleteWallet: UpdateWalletDto = {
      status: 0,
    };

    this.walletsRepository.merge(item, deleteWallet);

    return this.walletsRepository.save(item);
  }
}
