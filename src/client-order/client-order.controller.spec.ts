import { Test, TestingModule } from '@nestjs/testing';
import { ClientOrderController } from './client-order.controller';
import { ClientOrderService } from './client-order.service';

describe('ClientOrderController', () => {
  let controller: ClientOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientOrderController],
      providers: [ClientOrderService],
    }).compile();

    controller = module.get<ClientOrderController>(ClientOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
