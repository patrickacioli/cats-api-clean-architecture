import { DeleteCat } from '@application';
import { CreateCat } from '@application/usecase';
import { RepositoriesModule, UsecasesModule } from '@infra/modules';
import { CatDocument, CatSchemaFeature } from '@infra/schemas';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseMemoryServer } from '@test-utils';
import { Model } from 'mongoose';

describe('DeleteCat', () => {
  let app!: INestApplication;
  const mongooseMemoryServer = new MongooseMemoryServer();
  let usecaseUnderTest: DeleteCat;
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
        MongooseModule.forFeature([CatSchemaFeature]),
        mongooseMemoryServer.getRootModule(),
        UsecasesModule.forRoot(),
        RepositoriesModule.forRoot({
          datastore: 'mongodb',
        }),
      ],
    })
      .overrideProvider(CACHE_MANAGER)
      .useValue({
        store: {
          getClient: () => ({
            get: jest.fn().mockResolvedValue(null),
            pipeline: () => ({
              hset: jest.fn().mockResolvedValue({}),
              exec: jest.fn().mockResolvedValue({}),
              lpush: jest.fn().mockResolvedValue({}),
            }),
            hset: jest.fn().mockResolvedValue({}),
          }),
        },
      })
      .compile();

    app = moduleRef.createNestApplication({
      // logger: false,
    });

    createUseCase = app.get('CREATE_CAT');
    usecaseUnderTest = app.get('DELETE_CAT');

    catModel = moduleRef.get(getModelToken('Cat'));
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await catModel?.deleteMany({});
  });

  describe('execute', () => {
    it('should delete a cat', async () => {
      // ? Arrange
      const response = await createUseCase.execute({
        name: 'Garfield',
        age: 1,
        breed: 'Persian',
      });

      // ? Act
      const usecaseResult = await usecaseUnderTest.execute(response.id);

      // ? Assert
      expect(usecaseResult).toBeTruthy();
    });
    it('should throw exception when cat not found', async () => {
      // ? Act

      // This is a valid id, but it does not exist in the database
      const usecaseResult = await usecaseUnderTest.execute(
        '64303330e6b7131e3a1983f5',
      );

      // ? Assert
      await expect(usecaseResult).toBeFalsy();
    });
  });
});
