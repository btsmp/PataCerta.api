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
  create(data: CreateUserDto) {
    this.checkIfHasFielUndefined(data);

    return this.prisma.user.create({
      data,
    });
  }

  findAll() {
    return this.prisma.user.findMany({});
  }

  async findOne(id: string) {
    const data = await this.throwIfUserNotFound(id);
    return data;
  }

  async update(id: string, updatedUserData: UpdateUserDto) {
    await this.throwIfUserNotFound(id);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updatedUserData,
    });

    return updatedUser;
  }

  async delete(id: string) {
    await this.throwIfUserNotFound(id);

    return this.prisma.user.delete({ where: { id } });
  }

  private async throwIfUserNotFound(id: string) {
    const userExists = await this.prisma.user.findFirst({ where: { id } });

    if (!userExists) {
      throw new NotFoundException(`User ${id} does not exist`);
    } else {
      return userExists;
    }
  }

  private checkIfHasFielUndefined(data: CreateUserDto) {
    const hasUndefinedValue = Object.values(data).some(
      (value) => value === undefined,
    );

    if (hasUndefinedValue) {
      throw new BadRequestException('Invalid input data');
    }
  }
}
