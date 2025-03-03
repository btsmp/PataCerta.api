import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from '../../decorators/user.decorator';
import { CreatePetDto } from './dto/create-pet.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { PetsService } from './pets.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UpdatePetDto } from './dto/update-pet.dto';

@ApiTags('pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({ summary: 'Criar um novo pet' })
  @ApiResponse({
    status: 201,
    description: 'Pet criado com sucesso.',
    type: CreatePetDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async create(
    @Body() createPetDto: CreatePetDto,
    @User() user: AuthenticatedUser,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      return await this.petsService.create(createPetDto, user, files);
    } catch (error) {
      console.error('Error creating pet:', error.message);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os pets' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pets retornada com sucesso.',
    type: [CreatePetDto],
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      return await this.petsService.findAll(page, limit);
    } catch (error) {
      console.error('Error fetching pets:', error.message);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um pet pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Pet encontrado.',
    type: CreatePetDto,
  })
  @ApiResponse({ status: 404, description: 'Pet não encontrado.' })
  async findOne(@Param('id') id: string) {
    try {
      const pet = await this.petsService.findOne(id);
      return pet;
    } catch (error) {
      console.error(`Error finding pet with ID ${id}:`, error.message);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um pet pelo ID' })
  @ApiResponse({ status: 200, description: 'Pet atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Pet não encontrado.' })
  async update(
    @Param('id') id: string,
    @Body() updatePetDto: UpdatePetDto,
    @User() user: AuthenticatedUser,
  ) {
    try {
      return await this.petsService.update(id, updatePetDto, user);
    } catch (error) {
      console.error(`Error updating pet with ID ${id}:`, error.message);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar um pet pelo ID' })
  @ApiResponse({ status: 204, description: 'Pet deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Pet não encontrado.' })
  async remove(@Param('id') petId: string, @User() user: AuthenticatedUser) {
    try {
      await this.petsService.remove(petId, user);
    } catch (error) {
      console.error(`Error deleting pet with ID ${petId}:`, error.message);
      throw error;
    }
  }
}
