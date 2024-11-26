import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/config/prisma';
import { UpdatePetDto } from './dto/update-pet.dto';
import { CreatePetDto } from './dto/create-pet.dto';
import { CloudinaryService } from 'src/shared/config/cdn';
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
    const petOwner = await this.prisma.user.findFirst({
      where: { id: user.id },
    });

    if (!petOwner) {
      throw new NotFoundException('User not found');
    }

    const pet = await this.prisma.pet.create({
      data: {
        ...createPetDto,
        images: [],
        owner: {
          connect: { id: petOwner.id },
        },
      },
    });

    const petWithImagens = await this.updateProfilePicture(pet.id, files);
    return petWithImagens;
  }

  public async findAll() {
    return this.prisma.pet.findMany({});
  }

  public async findOne(id: string) {
    const pet = await this.prisma.pet.findFirst({ where: { id } });

    if (!pet) {
      throw new NotFoundException('pet not found');
    }

    return pet;
  }

  update(id: string, updatePetDto: UpdatePetDto) {
    console.debug(updatePetDto);
    return `This action updates a #${id} pet`;
  }

  public async remove(petId: string, user: AuthenticatedUser) {
    const petOwner = user.id;
    const pet = await this.prisma.pet.findFirst({ where: { id: petId } });

    if (!pet || pet.ownerId !== petOwner) {
      throw new NotFoundException(
        'Pet not found or you do not have permission to update it.',
      );
    }
    return 'Pet deleted successfully';
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
          console.log(url);
          return url; // Retorna a URL para ser adicionada à lista de imagens
        }),
      );

      return this.prisma.pet.update({
        where: { id },
        data: { images },
      });
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
