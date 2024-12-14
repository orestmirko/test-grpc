import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity, AdminEntity } from '@entities';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from '@repositories';
import { JwtModule } from '../jwt/jwt.module';
import { RedisService } from 'src/core/cache/redis.service';
import { RedisModule } from 'src/core/cache/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, AdminEntity]), JwtModule, RedisModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, RedisService],
})
export class ProductModule {}
