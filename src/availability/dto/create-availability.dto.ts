import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Days } from '../../common/enum/days.enum';

export class CreateAvailabilityDto {
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
