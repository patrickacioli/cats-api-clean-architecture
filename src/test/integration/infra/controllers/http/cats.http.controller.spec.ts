import { CatsHttpController } from '@infra/controllers';
import { UsecasesModule } from '@infra/modules';
import { Test, TestingModule } from '@nestjs/testing';
import { Cat } from '../../../../../domain/entity';

describe('CatsHttpController', () => {
  let controllerUnderTest: CatsHttpController;
  const mockUseCase = {
    execute: jest.fn(),
  };
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CatsHttpController],
      providers: [
        {
          provide: UsecasesModule.CREATE_CAT,
          useValue: mockUseCase,
        },
        {
          provide: UsecasesModule.GET_CAT,
          useValue: mockUseCase,
        },
        {
          provide: UsecasesModule.FIND_CATS,
          useValue: mockUseCase,
        },
        {
          provide: UsecasesModule.DELETE_CAT,
          useValue: mockUseCase,
        },
      ],
    }).compile();

    controllerUnderTest = moduleRef.get<CatsHttpController>(CatsHttpController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controllerUnderTest).toBeDefined();
  });

  describe('create', () => {
    it('should create a cat and return it', async () => {
      const result = new Cat({
        name: 'Test',
        age: 1,
        breed: 'Test',
      });
      mockUseCase.execute.mockResolvedValue(result);
      expect(
        await controllerUnderTest.create({
          name: 'Test',
          age: 1,
          breed: 'Test',
        }),
      ).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a cat', async () => {
      const result = new Cat({
        name: 'Test',
        age: 1,
        breed: 'Test',
      });
      mockUseCase.execute.mockResolvedValue(result);
      expect(await controllerUnderTest.findOne('1')).toEqual(result);
    });
  });

  describe('find', () => {
    it('should return a list of cats', async () => {
      const result = [
        new Cat({
          name: 'Test',
          age: 1,
          breed: 'Test',
        }),
      ];
      mockUseCase.execute.mockResolvedValue(result);
      expect(await controllerUnderTest.find()).toEqual(result);
    });
  });

  describe('delete', () => {
    it('should delete a cat', async () => {
      const result = new Cat({
        name: 'Test',
        age: 1,
        breed: 'Test',
      });
      mockUseCase.execute.mockResolvedValue(result);
      expect(await controllerUnderTest.delete('1')).toEqual(result);
    });
  });
});
