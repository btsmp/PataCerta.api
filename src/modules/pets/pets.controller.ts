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
} from '@nestjs/common';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Body() createPetDto: CreatePetDto,
    @User() user: AuthenticatedUser,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.petsService.create(createPetDto, user, files);
  }

  @Get()
  findAll() {
    return this.petsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(id);
  }

  // @UseGuards(AuthGuard)
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
  //   return this.petsService.update(id, updatePetDto);
  // }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') petId: string, @User() user: AuthenticatedUser) {
    return this.petsService.remove(petId, user);
  }
}
