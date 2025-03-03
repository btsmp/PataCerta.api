import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/config/prisma';

@Injectable()
export class InterestsService {
  constructor(private readonly prisma: PrismaService) {}

  // Método auxiliar para verificar se o pet existe e se o usuário pode interagir
  private async validatePetOwnership(petId: string, userId: string) {
    const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) throw new NotFoundException('Pet not found');
    if (pet.ownerId === userId) {
      throw new BadRequestException('Pet owner cannot be the interested');
    }
    return pet;
  }

  async create(petId: string, user: AuthenticatedUser) {
    // Validação separada para reutilização
    await this.validatePetOwnership(petId, user.id);

    // Criação do interesse
    const interest = await this.prisma.interest.create({
      data: {
        pet: { connect: { id: petId } },
        adopter: { connect: { id: user.id } },
      },
    });

    return interest;
  }

  async findAll(page = 1, limit = 10) {
    // Implementando paginação para evitar sobrecarga
    const skip = (page - 1) * limit;
    return this.prisma.interest.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(interestId: string) {
    const interest = await this.prisma.interest.findUnique({
      where: { id: interestId },
    });
    if (!interest) throw new NotFoundException('Interest not found');

    // Removendo o interesse
    await this.prisma.interest.delete({ where: { id: interestId } });

    return { message: 'Interest successfully deleted' };
  }
}
