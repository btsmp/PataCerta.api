import { CloudinaryService } from 'src/shared/config/cdn';
import { PrismaService } from '../../shared/config/prisma';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PetsController],
  providers: [PetsService, PrismaService, CloudinaryService],
})
export class PetsModule {}
