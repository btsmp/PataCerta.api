import { IsString } from 'class-validator';

export class CreatePetDto {
  @IsString()
  name: string;

  @IsString()
  species: string;

  @IsString()
  description: string;

  images: FileDto;
}

export class FileDto {
  @IsString()
  filename: string;

  @IsString()
  mimetype: string;

  @IsString()
  path: string;
}
