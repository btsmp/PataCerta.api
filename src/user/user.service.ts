import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../shared/config/prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  create({ email, name, password, isOng }: CreateUserDto) {
    if (
      email === undefined ||
      name === undefined ||
      password === undefined ||
      isOng === undefined
    ) {
      throw new BadRequestException('Invalid input data');
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
    return this.prisma.user.findMany({});
  }

  async findOne(id: string) {
    const data = await this.prisma.user.findFirst({ where: { id } });

    if (!data) {
      throw new NotFoundException(`User ${id} does not exist`);
    } else {
      return data;
    }
  }

  async update(id: string, updatedUserData: UpdateUserDto) {
    const userExists = await this.prisma.user.findFirst({ where: { id } });

    if (!userExists) {
      throw new NotFoundException(`User ${id} does not exist`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updatedUserData,
    });

    return updatedUser;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
