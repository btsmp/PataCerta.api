import { PrismaService } from '../../shared/config/prisma';
import { CloudinaryService } from 'src/shared/config/cdn';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PetsController],
  providers: [PetsService, PrismaService, CloudinaryService],
})
export class PetsModule {}
