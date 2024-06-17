import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Users } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { WalletsService } from './wallets.service';
import { OrdersService } from './orders.service';
import { Phase } from '../entities/phase.entity';
import { NotificationsService } from './notifications.service';
import { Wallet } from '../entities/wallet.entity';
import { Affiliate } from '../entities/affilate.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,

    @InjectRepository(Phase)
    private phaseRepository: Repository<Phase>,

    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,

    @InjectRepository(Affiliate)
    private affiliateRepository: Repository<Affiliate>,

    private walletsService: WalletsService,
    private ordersService: OrdersService,
    private notificationService: NotificationsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userByPhone = await this.userRepository.findOne({
      where: { phone: createUserDto.phone },
    });

    if (userByPhone) {
      throw new ConflictException('Este usuario ya existe con este teléfono');
    }

    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userByEmail) {
      throw new ConflictException(
        'Este usuario ya existe con este correo electrónico',
      );
    }

    let affiliateIdAffiliate;

    if (createUserDto.uuidAffiliate) {
      const uuidAffiliate = createUserDto.uuidAffiliate;
      delete createUserDto.uuidAffiliate;
      const affiliateMain = await this.affiliateRepository.findOne({
        where: { uuid: uuidAffiliate },
      });
      affiliateIdAffiliate = affiliateMain.id_affilitate;
    }

    const newUser = this.userRepository.create(createUserDto);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;

    //TODO
    const newAffiliate = new Affiliate();
    newAffiliate.email = newUser.email;
    newAffiliate.name = newUser.name;
    newAffiliate.phone = newUser.code_country + newUser.phone;
    newAffiliate.email = newUser.email;
    const savedAffiliate = await this.affiliateRepository.save(newAffiliate);

    const wallet = await this.walletsService.createWalletNewUser();
    if (affiliateIdAffiliate) {
      newUser.affiliateIdAffiliate = affiliateIdAffiliate;
    }
    newUser.walletId = wallet.id_wallet;
    newUser.wallet = wallet;
    newUser.affiliateId = savedAffiliate.id_affilitate;
    newUser.phaseIdPhase = 1;

    const savedUser = await this.userRepository.save(newUser);

    savedAffiliate.uuid = savedUser.uuid;
    await this.affiliateRepository.save(savedAffiliate);

    const firstOrder = await this.ordersService.firtsOrderByUser(
      savedUser.id_user,
    );

    await this.notificationService.firstNotification(
      savedUser.id_user,
      wallet.balance,
    );

    savedUser.orders = [];
    savedUser.orders.push(firstOrder);

    return savedUser;
  }

  async findAll() {
    const list = await this.userRepository.find({
      where: { status: 1 },
      relations: { wallet: true, orders: true },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findOne(id: number) {
    const item = await this.userRepository.findOne({
      where: { id_user: id, status: 1 },
      relations: ['wallet', 'orders'],
    });

    const phasesList = await this.phaseRepository.findOne({
      where: {
        id_phase: item.phaseIdPhase,
        status: 1,
        orders: { userIdUser: item.id_user, state: true },
      },
      relations: { orders: { state: true } },
    });

    item.phase = phasesList;

    if (!item) {
      throw new NotFoundException(`This user #${id} not found`);
    }
    return item;
  }

  async findbyemail(email: string) {
    const item = await this.userRepository.findOne({
      where: { email: email, status: 1 },
      relations: ['wallet', 'orders'],
    });

    const phasesList = await this.phaseRepository.findOne({
      where: {
        id_phase: item.phaseIdPhase,
        status: 1,
        orders: { userIdUser: item.id_user, state: true },
      },
      relations: { orders: { state: true } },
    });

    item.phase = phasesList;

    if (item) {
      return item;
    } else {
      throw new NotFoundException(`El usuario ${email} no se ha encontrado`);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const item = await this.userRepository.findOne({
      where: { id_user: id, status: 1 },
    });

    if (updateUserDto.password) {
      const hashPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashPassword;
    }

    this.userRepository.merge(item, updateUserDto);

    const savedUser = await this.userRepository.save(item);

    return savedUser;
  }

  async updateVIP(id: number) {
    const user = await this.userRepository.findOne({
      where: { id_user: id },
      relations: { wallet: true, orders: true },
    });

    if (!user) {
      throw new NotFoundException(`El usuario no se ha encontrado`);
    }

    let wallet = { ...user.wallet };

    if (wallet.balance > 0.0) {
      const nextPhase = user.phaseIdPhase + 1;
      const vipNumber: string = `vip_${nextPhase}_earnings`;
      wallet[vipNumber] = wallet.balance;
      wallet = await this.walletRepository.save(wallet);
    }

    user.wallet = wallet;

    const phase = await this.phaseRepository.findOne({
      where: {
        id_phase: user.phaseIdPhase,
        status: 1,
        orders: { userIdUser: user.id_user },
      },
      relations: { orders: true },
    });

    const taskNumber = phase.task_number;
    const ordersCompleted = phase.orders.filter(
      (order) => order.stateIdState === 3,
    ).length;

    if (taskNumber !== ordersCompleted) {
      throw new NotFoundException(`Hubo un error, porfavor contacte a soporte`);
    }

    const nextPhase = await this.phaseRepository.findOne({
      where: {
        id_phase: user.phaseIdPhase + 1,
        status: 1,
        orders: { userIdUser: user.id_user, state: true },
      },
      relations: { orders: { state: true } },
    });

    user.phaseIdPhase = user.phaseIdPhase + 1;
    user.phase = nextPhase;

    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const item = await this.userRepository.findOneBy({ id_user: id });
    const deleteUser: UpdateUserDto = {
      status: 0,
    };

    this.userRepository.merge(item, deleteUser);

    const savedUser = await this.userRepository.save(item);

    return savedUser;
  }
}
