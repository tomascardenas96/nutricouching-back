import { Module } from '@nestjs/common';
import { ViandService } from './viand.service';
import { ViandController } from './viand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Viand } from './entities/viand.entity';
import { IngredientModule } from 'src/ingredient/ingredient.module';

@Module({
  imports: [TypeOrmModule.forFeature([Viand]), IngredientModule],
  controllers: [ViandController],
  providers: [ViandService],
  exports: [ViandService],
})
export class ViandModule {}
