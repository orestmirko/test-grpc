import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@entities';
import { UserController } from '@controllers';
import { UserService } from '@providers';
import { JwtModule } from '../jwt/jwt.module';
import { RedisModule } from 'src/core/cache/redis.module';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule, RedisModule, SmsModule],
  controllers: [UserController],
  providers: [UserService, Logger],
})
export class UserModule {}
