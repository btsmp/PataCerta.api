import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FileDto {
  @ApiProperty({ description: 'Nome do arquivo da imagem' })
  @IsString()
  filename: string;

  @ApiProperty({ description: 'Tipo MIME da imagem' })
  @IsString()
  mimetype: string;

  @ApiProperty({ description: 'Caminho onde a imagem está armazenada' })
  @IsString()
  path: string;
}

export class CreatePetDto {
  @ApiProperty({ description: 'Nome do pet' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Espécie do pet' })
  @IsString()
  species: string;

  @ApiProperty({ description: 'Descrição do pet' })
  @IsString()
  description: string;

  @ApiProperty({
    type: [FileDto],
    description: 'Array de imagens do pet',
  })
  images: FileDto[];
}
