import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Days } from 'src/common/enum/days.enum';

export class CreateAvailabilityDto {
  @IsNotEmpty()
  @IsString()
  professionalId: string;

  @IsEnum(Days)
  @IsNotEmpty()
  day: Days;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsNumber()
  interval: number;
}
