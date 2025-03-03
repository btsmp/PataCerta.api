import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInterestDto {
  @ApiProperty({
    description: 'ID do pet para associar o interesse',
    type: String,
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'O petId deve ser um UUID válido (versão 4).' })
  petId: string;
}
