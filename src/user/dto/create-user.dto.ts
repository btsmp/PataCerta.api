import {
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  MinLength,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be valid.' })
  email: string;

  @IsNotEmpty({ message: 'Name cannot be empty.' })
  @IsString({ message: 'Name must to be a string.' })
  name: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;

  @IsBoolean({ message: 'The isOng field must be a boolean value.' })
  isOng?: boolean;
}
