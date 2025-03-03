import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: 'Título do evento',
    example: 'Workshop de NestJS',
  })
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório' })
  title: string;

  @ApiProperty({
    description: 'Descrição do evento',
    example: 'Um workshop sobre NestJS para iniciantes e intermediários.',
  })
  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  description: string;

  @ApiProperty({
    description: 'Localização do evento',
    example: 'Rua das Flores, 123, São Paulo, SP',
  })
  @IsString()
  @IsNotEmpty({ message: 'A localização é obrigatória' })
  location: string;

  @ApiProperty({
    description: 'Data e horário do evento',
    example: '2024-12-25T14:00:00.000Z',
  })
  @IsDate({ message: 'A data deve estar em um formato válido' })
  @Type(() => Date)
  date: Date;
}
