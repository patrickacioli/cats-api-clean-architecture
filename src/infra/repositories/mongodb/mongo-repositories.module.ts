import { Module } from '@nestjs/common';
import { CAT_REPOSITORY } from '../../common/contants';
import { CatsMongoDBRepository } from './cats-mongodb.repository';

@Module({})
export class MongoDBRepositoriesModule {
  static providers = [
    {
      provide: CAT_REPOSITORY,
      useClass: CatsMongoDBRepository,
    },
  ];

  static register() {
    return {
      module: MongoDBRepositoriesModule,
      providers: [...this.providers],
    };
  }
}
