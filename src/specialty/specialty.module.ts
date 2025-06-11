import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { Professional } from 'src/professional/entities/professional.entity';
import { UserModule } from 'src/user/user.module';
import { Specialty } from './entities/specialty.entity';
import { SpecialtyController } from './specialty.controller';
import { SpecialtyService } from './specialty.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Specialty, Professional]),
    UserModule,
    CategoryModule,
  ],
  controllers: [SpecialtyController],
  providers: [SpecialtyService],
  exports: [SpecialtyService],
})
export class SpecialtyModule {}
