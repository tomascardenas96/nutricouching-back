import { IsNumber, IsString } from 'class-validator';

export default class ServiceDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  image: string;
}
