import { Test, TestingModule } from '@nestjs/testing';
import { PlanPurchaseService } from './plan_purchase.service';

describe('PlanPurchaseService', () => {
  let service: PlanPurchaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanPurchaseService],
    }).compile();

    service = module.get<PlanPurchaseService>(PlanPurchaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
