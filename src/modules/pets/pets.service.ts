import { AuthenticatedUser } from 'src/interfaces/authenticated-user.interface';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/config/prisma';
import { UpdatePetDto } from './dto/update-pet.dto';
import { CreatePetDto } from './dto/create-pet.dto';
import { CloudinaryService } from 'src/shared/config/cdn';

@Injectable()
export class PetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cdn: CloudinaryService,
  ) {}
  public async create(createPetDto: CreatePetDto, user: AuthenticatedUser) {
    const petOwner = await this.prisma.user.findFirst({
      where: { id: user.id },
    });

    if (!petOwner) {
      throw new NotFoundException('User not found');
    }

    const pet = await this.prisma.pet.create({
      data: {
        ...createPetDto,
        status: 'pending',
        owner: {
          connect: { id: petOwner.id },
        },
      },
    });

    return pet;
  }

  public async findAll() {
    return this.prisma.pet.findMany({});
  }

  public async updateProfilePicture(id: string, file: Express.Multer.File) {
    const pet = this.prisma.pet.findFirst({ where: { id } });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    try {
      const { url: imageUrl } = await this.cdn.upload(file);
      return this.prisma.pet.update({
        where: { id },
        data: { profilePicUrl: imageUrl },
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  public async findOne(id: string) {
    const pet = await this.prisma.pet.findFirst({ where: { id } });

    if (!pet) {
      throw new NotFoundException('pet not found');
    }

    return pet;
  }

  update(id: string, updatePetDto: UpdatePetDto) {
    console.log(updatePetDto);
    return `This action updates a #${id} pet`;
  }

  remove(id: string) {
    return `This action removes a #${id} pet`;
  }
}
