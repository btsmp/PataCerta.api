import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CreateInterestDto } from './dto/create-interest.dto';
import { InterestsService } from './interests.service';
import { User } from 'src/decorators/user.decorator';

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  create(@Body() body: CreateInterestDto, @User() user: AuthenticatedUser) {
    return this.interestsService.create(body.petId, user);
  }

  @Get()
  findAll() {
    return this.interestsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interestsService.remove(id);
  }
}
