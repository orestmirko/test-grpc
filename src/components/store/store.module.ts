import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity, AdminEntity } from '@entities';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { JwtModule } from '../jwt/jwt.module';
import { RedisModule } from 'src/core/cache/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity, AdminEntity]), JwtModule, RedisModule],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
