import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Users } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;

    const savedUser = await this.userRepository.save(newUser);

    return savedUser;
  }

  async findAll() {
    const list = await this.userRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findOne(id: number) {
    const item = await this.userRepository.findOne({
      where: { id_user: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This user #${id} not found`);
    }
    return item;
  }

  async findOneUser(id: number) {
    const item = await this.userRepository.findOne({
      where: { id_user: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This user #${id} not found`);
    }
    return item;
  }

  async findbyemail(email: string) {
    const item = await this.userRepository.findOne({
      where: { email: email, status: 1 },
    });

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
