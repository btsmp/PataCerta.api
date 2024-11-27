import { IsUUID } from 'class-validator';

export class CreateInterestDto {
  @IsUUID()
  petId: string;
}
