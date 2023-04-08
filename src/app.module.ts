import {
  ControllersModule,
  RepositoriesModule,
  UsecasesModule,
} from '@infra/modules';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import * as redisStore from 'cache-manager-ioredis';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
      envFilePath: '.env',
      load: [],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<MongooseModuleOptions> => {
        const uri = configService.get<string>('MONGODB_URI');
        return {
          uri,
          autoIndex: true,
          ignoreUndefined: true,
        };
      },
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        ttl: configService.get<number>('REDIS_TTL'),
        password: configService.get<string>('REDIS_PASSWORD'),
        username: configService.get<string>('REDIS_USERNAME'),
      }),
    }),
    RepositoriesModule.forRoot({
      datastore: 'redis',
    }),
    ControllersModule.forRoot(),
    UsecasesModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
