import { Module } from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { SpecialtyController } from './specialty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialty } from './entities/specialty.entity';
import { ServiceModule } from 'src/service/service.module';
import { Professional } from 'src/professional/entities/professional.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Specialty, Professional]), ServiceModule],
  controllers: [SpecialtyController],
  providers: [SpecialtyService],
  exports: [SpecialtyService],
})
export class SpecialtyModule {}
