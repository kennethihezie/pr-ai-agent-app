import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { config } from '../../common/config/config';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T> {
    const cached = await this.cacheManager.get<T>(key);
    return cached
  }

  async set<T>(key: string, data: T, ttl: number = config.redis.ttl) {    
    await this.cacheManager.set<T>(key, data, ttl);
  }
}