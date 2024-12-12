import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateStoreDto, UpdateStoreDto, SetWorkHoursDto } from '@dtos';
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

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update store (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Store successfully updated',
    type: StoreEntity,
  })
  public async updateStore(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<StoreEntity> {
    return this.storeService.updateStore({
      adminId: req.user.sub,
      storeId: id,
      updateData: updateStoreDto,
    });
  }

  @Post(':id/work-hours')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set store work hours (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Work hours successfully set',
    type: StoreEntity,
  })
  public async setWorkHours(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() setWorkHoursDto: SetWorkHoursDto,
  ): Promise<StoreEntity> {
    return this.storeService.setWorkHours({
      adminId: req.user.sub,
      storeId: id,
      workHours: setWorkHoursDto.workHours,
    });
  }
}
