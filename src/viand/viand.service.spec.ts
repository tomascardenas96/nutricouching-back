import { Test, TestingModule } from '@nestjs/testing';
import { ViandService } from './viand.service';

describe('ViandService', () => {
  let service: ViandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViandService],
    }).compile();

    service = module.get<ViandService>(ViandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
