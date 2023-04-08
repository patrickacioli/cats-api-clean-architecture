import { CatsKafkaController } from '@infra/controllers';
import { UsecasesModule } from '@infra/modules';
import { Test, TestingModule } from '@nestjs/testing';

describe('CatsKafkaController', () => {
  let controllerUnderTest: CatsKafkaController;
  const mockUseCase = {
    execute: jest.fn(),
  };
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CatsKafkaController],
      imports: [],
      providers: [
        {
          provide: UsecasesModule.CREATE_CAT,
          useValue: mockUseCase,
        },
      ],
    }).compile();

    controllerUnderTest =
      moduleRef.get<CatsKafkaController>(CatsKafkaController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controllerUnderTest).toBeDefined();
  });

  describe('create', () => {
    it('should create a new cat from broker', () => {
      controllerUnderTest.create({
        name: 'Test',
        age: 1,
        breed: 'Test',
      });
      expect(mockUseCase.execute).toHaveBeenCalled();
    });
  });
});
