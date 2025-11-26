import { Test, TestingModule } from '@nestjs/testing';
import { MonitoriasController } from './monitorias.controller';

describe('MonitoriasController', () => {
  let controller: MonitoriasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitoriasController],
    }).compile();

    controller = module.get<MonitoriasController>(MonitoriasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
