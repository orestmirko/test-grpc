import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { RedisModule } from 'src/core/cache/redis.module';

@Module({
  imports: [RedisModule],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
