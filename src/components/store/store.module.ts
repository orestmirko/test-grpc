import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity, AdminEntity, StoreWorkHoursEntity } from '@entities';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { JwtModule } from '../jwt/jwt.module';
import { RedisModule } from 'src/core/cache/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreEntity, AdminEntity, StoreWorkHoursEntity]),
    JwtModule,
    RedisModule,
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
