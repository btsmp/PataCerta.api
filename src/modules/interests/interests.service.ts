import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/config/prisma';

@Injectable()
export class InterestsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(petId: string, user: AuthenticatedUser) {
    const pet = await this.prisma.pet.findFirst({ where: { id: petId } });

    if (!pet) throw new NotFoundException('pet not found');

    if (pet.ownerId === user.id)
      throw new BadRequestException('pet owner cannot be the interested');

    const interest = await this.prisma.interest.create({
      data: {
        pet: { connect: { id: petId } },
        adopter: { connect: { id: user.id } },
      },
    });

    return interest;
  }

  async findAll() {
    return this.prisma.interest.findMany({});
  }

  async remove(interestId: string) {
    const interest = await this.prisma.interest.findFirst({
      where: { id: interestId },
    });

    if (!interest) throw new NotFoundException('interest not found');

    await this.prisma.interest.delete({ where: { id: interestId } });
    return ``;
  }
}
