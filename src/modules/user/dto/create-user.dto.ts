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
import { UserRole } from '../../../common/enums/user-role.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'O e-mail deve ser válido.' })
  email: string;

  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  name: string;

  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;

  @IsOptional()
  @IsString({ message: 'O campo "aboutMe" deve ser uma string.' })
  aboutMe?: string;

  @IsOptional()
  @IsString({ message: 'O campo "profilePicUrl" deve ser uma string.' })
  profilePicUrl?: string;

  @IsOptional()
  @IsString({ message: 'O campo "city" deve ser uma string.' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'O campo "uf" deve ser uma string.' })
  uf?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'O CPF deve ser um número válido.' })
  cpf?: string;

  @IsOptional()
  @IsBoolean({ message: 'O campo "isOng" deve ser um valor booleano.' })
  isOng?: boolean;

  @IsOptional()
  @IsEnum(UserRole, { message: 'O campo "role" deve ser um valor válido.' })
  role?: UserRole;

  @IsOptional()
  @IsInt({
    message: 'O campo "age" deve ser um número inteiro.',
  })
  age?: number;
}
