import { Body, Controller, Post, Request, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProductDto, AddFlowerToProductDto } from '@dtos';
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

  @Post(':id/flowers')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add flowers to product (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Flowers successfully added to product',
    type: ProductEntity,
  })
  public async addFlowersToProduct(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() addFlowersDto: AddFlowerToProductDto,
  ): Promise<ProductEntity> {
    return this.productService.addFlowersToProduct(
      req.user.sub,
      id,
      addFlowersDto.flowers,
    );
  }
}
