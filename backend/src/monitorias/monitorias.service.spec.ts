import { Test, TestingModule } from '@nestjs/testing';
import { MonitoriasService } from './monitorias.service';

describe('MonitoriasService', () => {
  let service: MonitoriasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitoriasService],
    }).compile();

    service = module.get<MonitoriasService>(MonitoriasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
