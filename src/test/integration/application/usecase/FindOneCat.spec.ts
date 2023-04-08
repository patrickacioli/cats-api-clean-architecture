import { FindOneCat } from '@application';
import { CreateCat } from '@application/usecase';
import { RepositoriesModule, UsecasesModule } from '@infra/modules';
import { CatDocument, CatSchemaFeature } from '@infra/schemas';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseMemoryServer } from '@test-utils';
import { Model } from 'mongoose';

describe('FindOneCat', () => {
  let app!: INestApplication;
  const mongooseMemoryServer = new MongooseMemoryServer();
  let usecaseUnderTest: FindOneCat;
  let createUseCase: CreateCat;
  let catModel: Model<CatDocument>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(''),
          },
        },
      ],
      imports: [
        RepositoriesModule.forRoot({
          datastore: 'mongodb',
        }),
        MongooseModule.forFeature([CatSchemaFeature]),
        mongooseMemoryServer.getRootModule(),
        UsecasesModule.forRoot(),
      ],
    }).compile();

    app = moduleRef.createNestApplication({
      // logger: false,
    });

    createUseCase = app.get('CREATE_CAT');
    usecaseUnderTest = app.get('GET_CAT');

    catModel = moduleRef.get(getModelToken('Cat'));
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await catModel.deleteMany({});
  });

  describe('execute', () => {
    it('should return a cat', async () => {
      // ? Arrange
      const response = await createUseCase.execute({
        name: 'Garfield',
        age: 1,
        breed: 'Persian',
      });

      // ? Act
      const usecaseResult = await usecaseUnderTest.execute(response.id);

      // ? Assert
      expect(usecaseResult).toBeDefined();
      expect(usecaseResult.name).toEqual('Garfield');
      expect(usecaseResult.age).toEqual(1);
    });
    it('should throw exception when cat not found', async () => {
      // ? Act

      // This is a valid id, but it does not exist in the database
      const usecaseResult = usecaseUnderTest.execute(
        '64303330e6b7131e3a1983f5',
      );

      // ? Assert
      await expect(usecaseResult).rejects.toThrow('Entity Cat not found');
    });
  });
});
