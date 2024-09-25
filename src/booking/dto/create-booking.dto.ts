import { IsDateString, IsObject, IsString } from 'class-validator';
import { Service } from '../../service/entity/service.entity';
import { User } from '../../user/entity/user.entity';

export class CreateBookingDto {
  @IsDateString()
  date: Date;

  @IsString()
  time: string;

  @IsString()
  serviceId: string;

  @IsString()
  userId: string;

  @IsString()
  professionalId: string;
}
