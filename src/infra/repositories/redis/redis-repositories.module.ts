import { Module } from '@nestjs/common';
import { CAT_REPOSITORY } from '../../common/contants';
import { CatsRedisRepository } from './cats-redis.repository';

@Module({})
export class RedisRepositoriesModule {
  static providers = [
    {
      provide: CAT_REPOSITORY,
      useClass: CatsRedisRepository,
    },
  ];
  static register() {
    return {
      module: RedisRepositoriesModule,
      providers: [...this.providers],
    };
  }
}
