import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from '../../decorators/user.decorator';
import { CreatePetDto } from './dto/create-pet.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { PetsService } from './pets.service';

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

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
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
  async findOne(@Param('id') id: string) {
    try {
      return await this.petsService.findOne(id);
    } catch (error) {
      console.error(`Error finding pet with ID ${id}:`, error.message);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
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
  async remove(@Param('id') petId: string, @User() user: AuthenticatedUser) {
    try {
      await this.petsService.remove(petId, user);
    } catch (error) {
      console.error(`Error deleting pet with ID ${petId}:`, error.message);
      throw error;
    }
  }
}
