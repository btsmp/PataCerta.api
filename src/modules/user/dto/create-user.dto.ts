import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumberString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserRole } from '../../../common/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'usuario@example.com',
  })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'O e-mail deve ser válido.' })
  email: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João da Silva',
  })
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  name: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senhaSegura123',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;

  @ApiProperty({
    description: 'Descrição pessoal do usuário',
    example: 'Sou um amante de animais e voluntário em ONGs.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O campo "aboutMe" deve ser uma string.' })
  aboutMe?: string;

  @ApiProperty({
    description: 'URL da foto de perfil do usuário',
    example: 'https://example.com/minha-foto.jpg',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O campo "profilePicUrl" deve ser uma string.' })
  profilePicUrl?: string;

  @ApiProperty({
    description: 'Cidade do usuário',
    example: 'São Paulo',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O campo "city" deve ser uma string.' })
  city?: string;

  @ApiProperty({
    description: 'Estado (UF) do usuário',
    example: 'SP',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O campo "uf" deve ser uma string.' })
  uf?: string;

  @ApiProperty({
    description: 'CPF do usuário',
    example: '12345678901',
    required: false,
  })
  @IsOptional()
  @IsNumberString({}, { message: 'O CPF deve ser um número válido.' })
  cpf?: string;

  @ApiProperty({
    description: 'Indica se o usuário é uma ONG',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'O campo "isOng" deve ser um valor booleano.' })
  @Type(() => Boolean)
  isOng?: boolean;

  @ApiProperty({
    description: 'Função do usuário no sistema',
    example: UserRole.USER,
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'O campo "role" deve ser um valor válido.' })
  role?: UserRole;

  @ApiProperty({
    description: 'Idade do usuário',
    example: 25,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'O campo "age" deve ser um número inteiro.' })
  @Type(() => Number)
  age?: number;
}
