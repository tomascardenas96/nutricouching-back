import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  profileName: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  picture: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  coverPhoto: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  bio: string;
}
