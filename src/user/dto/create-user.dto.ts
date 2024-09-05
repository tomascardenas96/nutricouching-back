import { IsString, IsEmail, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsString()
  username: string;

  @IsDateString()
  birthDate: Date;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
