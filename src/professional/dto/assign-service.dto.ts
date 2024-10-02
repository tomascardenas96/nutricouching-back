import { IsNotEmpty, IsString } from 'class-validator';

export class AssignServiceDto {
  @IsString()
  @IsNotEmpty()
  professionalId: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string;
}
