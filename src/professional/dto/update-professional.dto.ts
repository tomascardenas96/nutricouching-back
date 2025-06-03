import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/common/enum/role.enum';

export class UpdateProfessionalDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone: string;

  @IsString()
  @IsEnum(Role)
  @IsNotEmpty()
  @IsOptional()
  role: Role;
}
