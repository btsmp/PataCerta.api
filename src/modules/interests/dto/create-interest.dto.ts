import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInterestDto {
  @ApiProperty({
    description: 'ID of the pet to associate interest with',
    type: String,
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'The petId must be a valid UUID (version 4).' })
  petId: string;
}
