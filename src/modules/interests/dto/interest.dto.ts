import { ApiProperty } from '@nestjs/swagger';

export class InterestDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  petId: string;

  @ApiProperty()
  userId: string;

  // Adicione outras propriedades conforme necessário
}
