import { Test, TestingModule } from '@nestjs/testing';
import { AnnualFormController } from './annual-form.controller';

describe('AnnualFormController', () => {
  let controller: AnnualFormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnualFormController],
    }).compile();

    controller = module.get<AnnualFormController>(AnnualFormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
