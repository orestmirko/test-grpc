import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  applyDecorators,
  UseInterceptors,
} from '@nestjs/common';
import { CallHandler, NestInterceptor } from '@nestjs/common';
import { RedisService } from 'src/core/cache/redis.service';
import { Observable } from 'rxjs';

class ThrottleInterceptor implements NestInterceptor {
  constructor(
    private limit: number,
    private ttl: number,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const ip = request.headers['x-forwarded-for'] || request.ip || request.socket.remoteAddress;

    const redisService = new RedisService();
    const key = `throttle:${ip}:${context.getHandler().name}`;

    const current = await redisService.get(key);
    const attempts = current ? parseInt(current) : 0;

    if (attempts >= this.limit) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    await redisService.set(key, (attempts + 1).toString(), this.ttl);
    return next.handle();
  }
}

export function Throttle(limit: number, ttl: number) {
  return applyDecorators(UseInterceptors(new ThrottleInterceptor(limit, ttl)));
}
