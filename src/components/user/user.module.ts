import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@entities';
import { UserController } from '@controllers';
import { UserService } from '@providers';
import { JwtModule } from '../jwt/jwt.module';
import { RedisModule } from 'src/core/cache/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule,
    RedisModule,
  ],
  controllers: [UserController],
  providers: [UserService, Logger],
})
export class UserModule {} 