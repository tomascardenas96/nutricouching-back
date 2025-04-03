import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanPurchase } from './entities/plan-pucharse.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { PlanService } from 'src/plan/plan.service';

@Injectable()
export class PlanPurchaseService {
  constructor(
    @InjectRepository(PlanPurchase)
    private readonly planPurchaseRepository: Repository<PlanPurchase>,
    private readonly planService: PlanService,
  ) {}

  async purchasePlan(user: User, planId: string, status: string) {
    try {
      const plan = await this.planService.getPlanById(planId);

      const newPlanPurchase = this.planPurchaseRepository.create({
        user,
        plan,
        payment_status: status,
      });

      return this.planPurchaseRepository.save(newPlanPurchase);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while purchasing plan');
    }
  }
}
