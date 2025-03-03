import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo evento' })
  @ApiResponse({ status: 201, description: 'Evento criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os eventos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos retornada com sucesso.',
  })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um evento pelo ID' })
  @ApiResponse({ status: 200, description: 'Evento encontrado.' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um evento pelo ID' })
  @ApiResponse({ status: 200, description: 'Evento atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um evento pelo ID' })
  @ApiResponse({ status: 204, description: 'Evento deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
