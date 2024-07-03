import { PartialType } from '@nestjs/mapped-types';
import { signInDTO } from './sign-in.dto';

export class UpdateAuthDto extends PartialType(signInDTO) {}
