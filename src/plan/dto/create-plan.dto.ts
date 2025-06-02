import { IsString } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  shortDescription: string;

  @IsString()
  price: string;
}
