import { MongooseModule } from '@nestjs/mongoose';
import { CatSchemaFeature } from '../schemas';
import { MongoDBRepositoriesModule } from './mongodb/mongo-repositories.module';
import { RedisRepositoriesModule } from './redis/redis-repositories.module';

export class RepositoryProvider {
  static getModule(datastore: string) {
    if (datastore === 'mongodb') {
      return this.createMongoDBModule();
    }
    if (datastore === 'redis') {
      return this.createRedisModule();
    }
  }

  private static createRedisModule() {
    const providers = RedisRepositoriesModule.providers;
    return {
      imports: [RedisRepositoriesModule],
      providers: [...providers],
      exports: [...providers],
    };
  }

  private static createMongoDBModule() {
    const providers = MongoDBRepositoriesModule.providers;
    return {
      imports: [
        MongoDBRepositoriesModule,
        MongooseModule.forFeature([CatSchemaFeature]),
      ],
      providers: [...providers],
      exports: [...providers],
    };
  }
}
