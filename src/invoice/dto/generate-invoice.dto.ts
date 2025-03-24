import { IsNumber, IsString } from 'class-validator';

export class GenerateInvoiceDto {
  @IsString()
  id: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsString()
  name: string;
}
