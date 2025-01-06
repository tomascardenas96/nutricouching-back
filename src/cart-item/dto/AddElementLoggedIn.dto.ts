import { IsOptional, IsString } from 'class-validator';

export class AddElementLoggedInDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  viandId?: string;
}
