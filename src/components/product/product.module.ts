import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity, AdminEntity } from '@entities';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, AdminEntity]), JwtModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
