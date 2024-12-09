import { IsArray, IsString } from 'class-validator';
import { AvailabilityInterface } from '../interface/availability.interface';
import { CreateAvailabilityDto } from 'src/availability/dto/create-availability.dto';

export class CreateProfessionalDto {
  @IsString()
  userId: string;

  @IsArray()
  specialtyId: string[];

  @IsArray()
  availability: CreateAvailabilityDto[];
}
