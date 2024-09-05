import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { Service } from './entity/service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
