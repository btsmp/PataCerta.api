import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateInterestDto } from './dto/create-interest.dto';
import { InterestsService } from './interests.service';
import { User } from '../../decorators/user.decorator';
import { Interest } from '@prisma/client';
import { InterestDto } from './dto/interest.dto';

@ApiTags('interests')
@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo interesse' })
  @ApiResponse({
    status: 201,
    description: 'Interesse criado com sucesso.',
    type: InterestDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou regra de negócio violada.',
  })
  create(
    @Body() body: CreateInterestDto,
    @User() user: AuthenticatedUser,
  ): Promise<Interest> {
    return this.interestsService.create(body.petId, user);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all interests' })
  @ApiResponse({
    status: 200,
    description: 'Lista de interesses recuperada com sucesso.',
    type: [InterestDto],
  })
  findAll(): Promise<Interest[]> {
    return this.interestsService.findAll();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an interest by ID' })
  @ApiResponse({ status: 204, description: 'Interesse deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Interesse não encontrado.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.interestsService.remove(id);
  }
}
