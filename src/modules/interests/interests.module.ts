import { InterestsController } from './interests.controller';
import { PrismaService } from 'src/shared/config/prisma';
import { InterestsService } from './interests.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [InterestsController],
  providers: [InterestsService, PrismaService],
})
export class InterestsModule {}
