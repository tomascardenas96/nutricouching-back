import { Test, TestingModule } from '@nestjs/testing';
import { PlanPurchaseController } from './plan_purchase.controller';
import { PlanPurchaseService } from './plan_purchase.service';

describe('PlanPurchaseController', () => {
  let controller: PlanPurchaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanPurchaseController],
      providers: [PlanPurchaseService],
    }).compile();

    controller = module.get<PlanPurchaseController>(PlanPurchaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
