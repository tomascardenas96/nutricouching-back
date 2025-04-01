import { Module } from '@nestjs/common';
import { PlanPurchaseService } from './plan_purchase.service';
import { PlanPurchaseController } from './plan_purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanPurchase } from './entities/plan-pucharse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanPurchase])],
  controllers: [PlanPurchaseController],
  providers: [PlanPurchaseService],
  exports: [PlanPurchaseService],
})
export class PlanPurchaseModule {}
