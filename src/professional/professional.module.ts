import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ServiceModule } from '../service/service.module';
import { SpecialtyModule } from '../specialty/specialty.module';
import { UserModule } from '../user/user.module';
import { Professional } from './entities/professional.entity';
import { ProfessionalController } from './professional.controller';
import { ProfessionalService } from './professional.service';
import { Specialty } from 'src/specialty/entities/specialty.entity';
import { ServiceModule } from 'src/service/service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Professional, Specialty]),
    UserModule,
    SpecialtyModule,
    ProfessionalModule,
    ServiceModule
  ],
  controllers: [ProfessionalController],
  providers: [ProfessionalService],
  exports: [ProfessionalService],
})
export class ProfessionalModule {}
