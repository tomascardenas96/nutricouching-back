import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Days } from 'src/common/enum/days.enum';

export class CreateAvailabilityDto {
  @IsNotEmpty()
  @IsString()
  professionalId: string;

  @IsArray()
  @IsNotEmpty()
  days: Days[];

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}
 