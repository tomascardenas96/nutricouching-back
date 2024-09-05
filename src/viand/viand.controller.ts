import { Controller } from '@nestjs/common';
import { ViandService } from './viand.service';

@Controller('viand')
export class ViandController {
  constructor(private readonly viandService: ViandService) {}
}
