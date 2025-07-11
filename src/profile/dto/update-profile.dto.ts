import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  profileName: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  bio: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  instagram: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  facebook: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  x: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  tiktok: string;

}
