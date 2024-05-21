import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';

import { Wallet } from '../entities/wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    public walletsRepository: Repository<Wallet>,
  ) {}

  create(createWalletDto: CreateWalletDto) {
    const newWallet = this.walletsRepository.create(createWalletDto);
    return this.walletsRepository.save(newWallet);
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
