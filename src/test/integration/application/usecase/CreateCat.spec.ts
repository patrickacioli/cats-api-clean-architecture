import { CreateCat } from '@application/usecase';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseMemoryServer } from '@test-utils';
import { RepositoriesModule, UsecasesModule } from '../../../../infra';

describe('CreateCat', () => {
  let app!: INestApplication;
  const mongooseMemoryServer = new MongooseMemoryServer();
  let usecaseUnderTest: CreateCat;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          isGlobal: true,
        }),
        mongooseMemoryServer.getRootModule(),
        RepositoriesModule.forRoot({
          datastore: 'mongodb',
        }),
        UsecasesModule.forRoot(),
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
    usecaseUnderTest = app.get('CREATE_CAT');
  });

  describe('execute', () => {
    it('should create a cat', async () => {
      expect(usecaseUnderTest).toBeDefined();
    });
    it('should create a cat', async () => {
      const usecaseResult = await usecaseUnderTest.execute({
        name: 'Garfield',
        age: 1,
        breed: 'Persian',
      });
      expect(usecaseResult).toBeDefined();
      expect(usecaseResult.name).toEqual('Garfield');
      expect(usecaseResult.age).toEqual(1);
    });
  });
});
