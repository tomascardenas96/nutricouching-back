import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class ServiceDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  price: string;
}
