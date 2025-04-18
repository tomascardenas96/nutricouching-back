import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PlanService } from '../plan.service';

@Injectable()
export class PlanAccessGuard implements CanActivate {
  constructor(private readonly planService: PlanService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const planId = request.params.planId;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const hasAccess = await this.planService.hasUserPurchasedPlan(
      user.userId,
      planId,
    );

    if (!hasAccess) {
      throw new ForbiddenException('Plan not purchased');
    }

    return true;
  }
}
