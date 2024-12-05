import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FileDto {
  @ApiProperty({ description: 'File name of the image' })
  @IsString()
  filename: string;

  @ApiProperty({ description: 'MIME type of the image' })
  @IsString()
  mimetype: string;

  @ApiProperty({ description: 'Path where the image is stored' })
  @IsString()
  path: string;
}
export class CreatePetDto {
  @ApiProperty({ description: 'Name of the pet' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Species of the pet' })
  @IsString()
  species: string;

  @ApiProperty({ description: 'Description of the pet' })
  @IsString()
  description: string;

  @ApiProperty({
    type: [FileDto],
    description: 'Array of images for the pet',
  })
  images: FileDto[];
}
