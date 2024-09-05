import { Module } from '@nestjs/common';
import { ViandService } from './viand.service';
import { ViandController } from './viand.controller';

@Module({
  controllers: [ViandController],
  providers: [ViandService],
})
export class ViandModule {}
