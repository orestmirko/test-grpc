import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import CONFIG from '@config';

@Injectable()
export class RedisService {
  private readonly redis: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    this.redis = new Redis({
      host: CONFIG.REDIS.HOST,
      port: CONFIG.REDIS.PORT,
    });
    this.redis.on('error', (error: Error) => {
      this.logger.error('Redis connection error:', error.message);
    });

    this.redis.on('connect', () => {
      this.logger.log('Successfully connected to Redis');
    });
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, value, 'EX', ttl);
    } else {
      await this.redis.set(key, value, 'EX', CONFIG.REDIS.TTL);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  async keys(pattern: string): Promise<string[]> {
    return this.redis.keys(pattern);
  }
}
