import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Cat } from '../../../domain/entity';
import { CatRepository } from '../../../domain/interfaces';

@Injectable()
export class CatsRedisRepository extends CatRepository {
  readonly client;
  private static KEY_PREFIX = 'catsdb';
  constructor(@Inject(CACHE_MANAGER) private cacheManager: any) {
    super();
    console.log('cacheManager', cacheManager);
    this.client = cacheManager.store.getClient();
  }

  async get<CateType>(id: string): Promise<CateType> {
    const response = await this.client.get(id);
    return this.toEntity(JSON.parse(response), Cat);
  }

  async save<Cat>(input: Cat): Promise<Cat> {
    const id = crypto.randomBytes(16).toString('hex');
    const cat = new Cat({
      ...input,
      id,
      createdAt: new Date().toISOString(),
    });

    const pipeline = this.client.pipeline();

    pipeline.hset(`${CatsRedisRepository.KEY_PREFIX}:${id}`, {
      ...cat,
      id,
      createdAt: new Date().toISOString(),
    });

    for (const key in cat) {
      const value = String(cat[key]).toLocaleLowerCase();
      pipeline.hset(`${CatsRedisRepository.KEY_PREFIX}:${key}`, value, id);
    }
    pipeline.lpush(CatsRedisRepository.KEY_PREFIX, id);
    await pipeline.exec();
    return this.toEntity({ ...cat, id }, Cat);
  }

  async delete(id: string): Promise<boolean> {
    const response = await this.client.del(
      `${CatsRedisRepository.KEY_PREFIX}:${id}`,
    );

    for (const key in Cat) {
      const value = String(Cat[key]).toLocaleLowerCase();
      await this.client.hdel(`${CatsRedisRepository.KEY_PREFIX}:${key}`, value);
    }

    if (response === 1) {
      this.client.lrem(CatsRedisRepository.KEY_PREFIX, 0, id);
      return true;
    }
    return false;
  }

  async findAll<Cat>(): Promise<Cat[]> {
    // Get all cats from db
    const catsIds = await this.client.lrange(
      CatsRedisRepository.KEY_PREFIX,
      0,
      -1,
    );
    return Promise.all(
      catsIds.map(async (cat) => {
        const response = await this.client.hgetall(
          `${CatsRedisRepository.KEY_PREFIX}:${cat}`,
        );
        if (!response) return null;
        return this.toEntity(response, Cat);
      }),
    );
  }
}
