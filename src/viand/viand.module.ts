import { Module } from '@nestjs/common';
import { ViandService } from './viand.service';
import { ViandController } from './viand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Viand } from './entities/viand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Viand])],
  controllers: [ViandController],
  providers: [ViandService],
})
export class ViandModule {}
