import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateViandDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  stock: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image?: string;
}
