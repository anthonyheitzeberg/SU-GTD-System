import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { SignUp } from './dto/sign-up.dto';
import { LogIn } from './dto/log-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async register(signUp: SignUp) {
    const user = await this.userService.create(signUp);
    const token = this.signToken(user);

    delete user.password;

    return {
      user,
      token,
    };
  }

  async login(logIn: LogIn) {
    let user: User;

    try {
      user = await this.userService.findOne({ where: { email: logIn.email } });
    } catch (err) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${logIn.email}`
      );
    }

    if (!(await user.checkPassword(logIn.password))) {
      throw new UnauthorizedException(
        `Wrong password for user with email: ${logIn.email}`
      );
    }

    const token = this.signToken(user);
    delete user.password;

    return {
      user,
      token,
    };
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    let user: User;

    try {
      user = await this.userService.findOne({ where: { email: payload.sub } });
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${payload.sub}`
      );
    }
    delete user.password;

    return user;
  }

  signToken(user: User): string {
    const payload = {
      sub: user.email,
    };

    return this.jwtService.sign(payload);
  }
}
