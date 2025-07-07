import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  specialtyId: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;

  @IsNotEmpty()
  @IsNumber()
  interval: number;

  @IsNotEmpty()
  @IsString()
  professionalId: string;
}
