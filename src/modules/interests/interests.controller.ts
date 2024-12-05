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
import { User } from 'src/decorators/user.decorator';
import { Interest } from '@prisma/client';

@ApiTags('interests')
@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new interest' })
  @ApiResponse({ status: 201, description: 'Interest created successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or business rule violated.',
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
    description: 'List of interests retrieved successfully.',
  })
  findAll(): Promise<Interest[]> {
    return this.interestsService.findAll();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an interest by ID' })
  @ApiResponse({ status: 204, description: 'Interest deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Interest not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.interestsService.remove(id);
  }
}
