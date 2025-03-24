import { Module } from '@nestjs/common';
import { ViandService } from './viand.service';
import { ViandController } from './viand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Viand } from './entities/viand.entity';
import { IngredientModule } from 'src/ingredient/ingredient.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Viand]), IngredientModule, UserModule],
  controllers: [ViandController],
  providers: [ViandService],
  exports: [ViandService],
})
export class ViandModule {}
