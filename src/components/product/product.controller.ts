import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProductDto } from '@dtos';
import { AuthGuard, Roles } from '@guards';
import { UserRole } from '@enums';
import { ProductEntity } from '@entities';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new product (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created',
    type: ProductEntity,
  })
  public async createProduct(
    @Request() req,
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(req.user.sub, createProductDto);
  }
}
