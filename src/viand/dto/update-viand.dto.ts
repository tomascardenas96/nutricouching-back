import { PartialType } from '@nestjs/mapped-types';
import { CreateViandDto } from './create-viand.dto';

export class UpdateViandDto extends PartialType(CreateViandDto) {}
