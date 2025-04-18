import { Controller } from '@nestjs/common';
import { PlanPurchaseService } from './plan_purchase.service';

@Controller('plan-purchase')
export class PlanPurchaseController {
  constructor(private readonly planPurchaseService: PlanPurchaseService) {}
}
