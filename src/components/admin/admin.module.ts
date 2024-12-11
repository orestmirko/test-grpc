import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from '@entities';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtModule } from '../jwt/jwt.module';
import { EmailModule } from '../email/email.module';
import { RedisModule } from 'src/core/cache/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]), JwtModule, RedisModule, EmailModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
