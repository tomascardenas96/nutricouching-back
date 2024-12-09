import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AssignSpecialtyDto {
  @IsString()
  @IsNotEmpty()
  professionalId: string;

  @IsArray()
  @IsNotEmpty()
  specialtyId: string[];
}
