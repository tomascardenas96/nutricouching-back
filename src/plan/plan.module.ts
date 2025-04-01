import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { UserModule } from 'src/user/user.module';
import { PlanPurchaseModule } from 'src/plan_purchase/plan_purchase.module';
import { PlanPurchase } from 'src/plan_purchase/entities/plan-pucharse.entity';
import { MercadopagoModule } from 'src/mercadopago/mercadopago.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan, PlanPurchase]),
    UserModule,
    MercadopagoModule,
  ],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
