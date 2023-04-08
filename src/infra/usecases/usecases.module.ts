import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCat, DeleteCat, FindCats, FindOneCat } from '../../application';
import { CatRepository } from '../../domain';
import { CAT_REPOSITORY } from '../common/contants';

@Module({})
export class UsecasesModule {
  static CREATE_CAT = 'CREATE_CAT';
  static GET_CAT = 'GET_CAT';
  static DELETE_CAT = 'DELETE_CAT';
  static FIND_CATS = 'FIND_CATS';

  static defaultModule = {
    module: UsecasesModule,
    providers: [
      Logger,
      ConfigService,
      {
        provide: UsecasesModule.FIND_CATS,
        inject: [CAT_REPOSITORY],
        useFactory: (catRepository: CatRepository) => {
          return new FindCats(catRepository);
        },
      },
      {
        provide: UsecasesModule.CREATE_CAT,
        inject: [CAT_REPOSITORY, Logger],
        useFactory: (catRepository: CatRepository, logger: Logger) => {
          return new CreateCat(catRepository, logger);
        },
      },
      {
        provide: UsecasesModule.GET_CAT,
        inject: [CAT_REPOSITORY],
        useFactory: (catRepository: CatRepository) => {
          return new FindOneCat(catRepository);
        },
      },
      {
        provide: UsecasesModule.DELETE_CAT,
        inject: [CAT_REPOSITORY],
        useFactory: (catRepository: CatRepository) => {
          return new DeleteCat(catRepository);
        },
      },
    ],
    exports: [
      UsecasesModule.CREATE_CAT,
      UsecasesModule.GET_CAT,
      UsecasesModule.DELETE_CAT,
      UsecasesModule.FIND_CATS,
    ],
  };

  static forRoot(): DynamicModule {
    const providers = this.defaultModule.providers;
    return {
      ...this.defaultModule,
      imports: [],
      providers: [...providers],
      global: true,
    };
  }
  static forFeature(datastore: string): DynamicModule {
    return {
      ...this.defaultModule,
    };
  }
}
