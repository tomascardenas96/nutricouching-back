import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateProfessionalDto {
  @IsString()
  fullname: string;

  @IsString()
  specialty: string;

  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  facebookURL: string;

  @IsOptional()
  @IsString()
  youtubeURL: string;

  @IsOptional()
  @IsString()
  instagramURL: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;
}
