import { IsString, IsEmail, IsDateString } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsString()
  lastname: string;
  
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
