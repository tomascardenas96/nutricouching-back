import { IsString } from 'class-validator';

export class CreateSpecialtyDto {
  @IsString()
  name: string;

  @IsString()
  serviceId: string;
}
