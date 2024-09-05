import { Test, TestingModule } from '@nestjs/testing';
import { ViandController } from './viand.controller';
import { ViandService } from './viand.service';

describe('ViandController', () => {
  let controller: ViandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViandController],
      providers: [ViandService],
    }).compile();

    controller = module.get<ViandController>(ViandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
