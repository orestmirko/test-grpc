import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Param,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  Delete,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProductDto, AddFlowerToProductDto, UpdateProductDto } from '@dtos';
import { AuthGuard, Roles } from '@guards';
import { UserRole } from '@enums';
import { ProductEntity } from '@entities';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
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
    return this.productService.addFlowersToProduct(req.user.sub, id, addFlowersDto.flowers);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns product details',
    type: ProductEntity,
  })
  public async getProduct(@Param('id', ParseIntPipe) id: number): Promise<ProductEntity> {
    return this.productService.getProduct(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated',
    type: ProductEntity,
  })
  public async updateProduct(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.updateProduct(req.user.sub, id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Product successfully deleted',
  })
  public async deleteProduct(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.deleteProduct(req.user.sub, id);
  }
}
