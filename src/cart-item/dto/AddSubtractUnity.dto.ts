import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AddOrSubtractEnum } from '../enum/AddOrSubtract.enum';

export class AddSubtractUnityDto {
  @IsEnum(AddOrSubtractEnum)
  action: AddOrSubtractEnum;
}
