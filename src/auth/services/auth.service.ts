import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/services/users.service';
import { Users } from 'src/users/entities/user.entity';
import { PayloadToken } from '../models/token.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findbyemail(email);
    if (!user.isEnabled) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      return user;
    }
    return null;
  }

  async validateUserCRM(email: string, password: string) {
    const user = await this.usersService.findbyemail(email);
    if (!user.isEnabledToCrm) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      return user;
    }
    return null;
  }

  async getUserLogById(idUser) {
    const user = await this.usersService.findOne(idUser);
    return user;
  }

  generateJWT(user: Users) {
    const payload: PayloadToken = { sub: user.id_user };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
