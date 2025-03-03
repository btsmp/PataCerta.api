import { PrismaService } from '../../shared/config/prisma';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [EventsController],
  providers: [EventsService, PrismaService],
})
export class EventsModule {}
