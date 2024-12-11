import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateStoreDto } from '@dtos';
import { AuthGuard, Roles } from '@guards';
import { UserRole } from '@enums';
import { StoreEntity } from '@entities';
import { StoreService } from './store.service';
@ApiTags('Stores')
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new store (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Store successfully created',
    type: StoreEntity,
  })
  public async createStore(
    @Request() req,
    @Body() createStoreDto: CreateStoreDto,
  ): Promise<StoreEntity> {
    return this.storeService.createStore(req.user.sub, createStoreDto);
  }
}
