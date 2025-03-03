import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/config/prisma';
import { UpdatePetDto } from './dto/update-pet.dto';
import { CreatePetDto } from './dto/create-pet.dto';
import { CloudinaryService } from '../../shared/config/cdn';
import * as sharp from 'sharp';

@Injectable()
export class PetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cdn: CloudinaryService,
  ) {}

  public async create(
    createPetDto: CreatePetDto,
    user: AuthenticatedUser,
    files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new InternalServerErrorException('No images provided.');
    }

    const pet = await this.prisma.$transaction(async (prisma) => {
      const petOwner = await prisma.user.findFirst({
        where: { id: user.id },
      });

      if (!petOwner) {
        throw new NotFoundException('User not found');
      }

      const newPet = await prisma.pet.create({
        data: {
          ...createPetDto,
          images: [],
          owner: {
            connect: { id: petOwner.id },
          },
        },
      });

      const images = await this.updateProfilePicture(newPet.id, files);
      return prisma.pet.update({
        where: { id: newPet.id },
        data: { images },
      });
    });

    return pet;
  }

  public async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.prisma.pet.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  public async findOne(id: string) {
    const pet = await this.prisma.pet.findFirst({ where: { id } });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    return pet;
  }

  public async update(
    id: string,
    updatePetDto: UpdatePetDto,
    user: AuthenticatedUser,
  ) {
    const pet = await this.prisma.pet.findUnique({ where: { id } });
    const owner = await this.prisma.pet.findFirst({
      where: { ownerId: user.id },
    });

    if (!owner) {
      throw new BadRequestException('Only owner can update pet');
    }
    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    return this.prisma.pet.update({
      where: { id },
      data: { ...updatePetDto, images: [] },
    });
  }

  public async remove(petId: string, user: AuthenticatedUser) {
    const pet = await this.prisma.pet.findFirst({ where: { id: petId } });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    if (pet.ownerId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this pet.',
      );
    }

    await this.prisma.pet.delete({ where: { id: petId } });
    return { message: 'Pet deleted successfully' };
  }

  private async updateProfilePicture(id: string, files: Express.Multer.File[]) {
    try {
      const images = await Promise.all(
        files.map(async (file) => {
          const compressedBuffer = await this.compressImage(file);
          const { url } = await this.cdn.upload({
            ...file,
            buffer: compressedBuffer,
          });
          return url;
        }),
      );

      return images;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw new InternalServerErrorException(
        'Failed to update profile picture.',
      );
    }
  }

  private async compressImage(file: Express.Multer.File): Promise<Buffer> {
    return sharp(file.buffer).jpeg({ quality: 60 }).toBuffer();
  }
}
