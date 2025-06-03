import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
} from 'class-validator';
import { Days } from '../../common/enum/days.enum';

export class CreateAvailabilityDto {
  @IsArray()
  @IsEnum(Days, { each: true })
  @IsNotEmpty()
  day: Days[];

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsNumber()
  interval: number;
}
