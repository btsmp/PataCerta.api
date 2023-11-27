import { PrismaService } from '../../shared/config/prisma';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PetsController],
  providers: [PetsService, PrismaService],
})
export class PetsModule {}
