import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../shared/config/prisma';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { signInDTO } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}
  public async validateUser({ email, password }: signInDTO) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!user || !bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('Email ou senha incorretas');
    }

    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = await this.jwt.signAsync(payload);
    return {
      access_token: token,
      user: payload,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${updateAuthDto} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
