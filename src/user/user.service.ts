import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../shared/config/prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  create({ email, name, password, isOng }: CreateUserDto) {
    if ((email || name || password || isOng) === undefined) {
      return undefined;
    }
    return this.prisma.user.create({
      data: {
        email,
        name,
        password,
        isOng,
      },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${updateUserDto} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
