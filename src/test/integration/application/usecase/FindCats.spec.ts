import { RepositoriesModule, UsecasesModule } from '@infra/modules';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseMemoryServer } from '@test-utils';
import { CreateCat, FindCats } from '../../../../application';

import { ConfigService } from '@nestjs/config';

describe('FindCats', () => {
  let app!: INestApplication;
  const mongooseMemoryServer = new MongooseMemoryServer();
  let usecaseUnderTest: FindCats;
  let createUseCase: CreateCat;

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
        mongooseMemoryServer.getRootModule(),
        UsecasesModule.forRoot(),
        RepositoriesModule.forRoot({
          datastore: 'mongodb',
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication({
      // logger: false,
    });
    createUseCase = app.get('CREATE_CAT');
    usecaseUnderTest = app.get('FIND_CATS');
  });

  describe('execute', () => {
    it('should find a cat', async () => {
      await createUseCase.execute({
        name: 'Garfield',
        age: 1,
        breed: 'Persian',
      });
      const usecaseResult = await usecaseUnderTest.execute();
      expect(usecaseResult).toBeDefined();
      expect(usecaseResult).toHaveLength(1);
      expect(usecaseResult[0].name).toEqual('Garfield');
    });
  });
});
