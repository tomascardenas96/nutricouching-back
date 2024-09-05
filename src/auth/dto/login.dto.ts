import { IsString, IsOptional } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  password: string;
}
