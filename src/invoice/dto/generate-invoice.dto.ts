import { IsNumber, IsString } from 'class-validator';

export class GenerateInvoiceDto {
  @IsString()
  itemId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsString()
  name: string;
}
