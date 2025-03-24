import { IsArray, IsOptional, IsString } from 'class-validator';
import { AvailabilityInterface } from '../interface/availability.interface';
import { CreateAvailabilityDto } from 'src/availability/dto/create-availability.dto';
import { Specialty } from 'src/specialty/entities/specialty.entity';

export class CreateProfessionalDto {
  @IsString()
  userId: string;

  @IsArray()
  specialties: Specialty[];
}
