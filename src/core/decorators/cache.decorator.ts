import { Logger } from '@nestjs/common';
import { RedisService } from '../cache/redis.service';

const logger = new Logger('CacheDecorator');

export function Cached(prefix: string, ttl: number = 3600) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const redisService = (this as any).redisService as RedisService;

        if (!redisService) {
          logger.warn('RedisService not found, skipping cache');
          return originalMethod.apply(this, args);
        }

        const key = `${prefix}:${propertyKey}:${args
          .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : arg))
          .join(':')}`;

        const cachedValue = await redisService.get(key);
        if (cachedValue) {
          logger.debug(`Cache hit for key: ${key}`);
          return JSON.parse(cachedValue);
        }

        logger.debug(`Cache miss for key: ${key}`);
        const result = await originalMethod.apply(this, args);

        if (result) {
          await redisService.set(key, JSON.stringify(result), ttl);
          logger.debug(`Cached value for key: ${key}`);
        }

        return result;
      } catch (error) {
        logger.error(`Cache error: ${error.message}`);
        return originalMethod.apply(this, args);
      }
    };

    return descriptor;
  };
}

export function ClearCache(prefix: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalMethod.apply(this, args);

        const redisService = (this as any).redisService as RedisService;
        if (redisService) {
          const pattern = `${prefix}:*`;
          const keys = await redisService.keys(pattern);

          if (keys.length > 0) {
            await Promise.all(keys.map((key) => redisService.del(key)));
            logger.debug(`Cleared ${keys.length} cache keys with prefix: ${prefix}`);
          }
        }

        return result;
      } catch (error) {
        logger.error(`Cache clear error: ${error.message}`);
        return originalMethod.apply(this, args);
      }
    };

    return descriptor;
  };
}
