import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  stock: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image?: string;
}
