import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { StoreEntity, AdminEntity, StoreWorkHoursEntity } from '@entities';
import { CreateStoreDto } from '@dtos';
import { ISetWorkHoursParams, IUpdateStoreParams, IPublishStoreParams } from '@interfaces';

@Injectable()
export class StoreService {
  private readonly logger = new Logger(StoreService.name);

  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    @InjectRepository(StoreWorkHoursEntity)
    private readonly workHoursRepository: Repository<StoreWorkHoursEntity>,
  ) {}

  public async createStore(adminId: number, createStoreDto: CreateStoreDto): Promise<StoreEntity> {
    try {
      const admin = await this.adminRepository.findOne({
        where: { id: adminId },
        relations: ['store'],
      });

      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      if (admin.store) {
        throw new ConflictException('Admin already has a store');
      }

      const existingStoreByPhone = await this.storeRepository.findOne({
        where: { phone: createStoreDto.phone },
      });

      if (existingStoreByPhone) {
        throw new ConflictException('Store with this phone already exists');
      }

      if (createStoreDto.email) {
        const existingStoreByEmail = await this.storeRepository.findOne({
          where: { email: createStoreDto.email },
        });

        if (existingStoreByEmail) {
          throw new ConflictException('Store with this email already exists');
        }
      }

      const store = this.storeRepository.create({
        ...createStoreDto,
      });

      const savedStore = await this.storeRepository.save(store);
      admin.store = savedStore;
      await this.adminRepository.save(admin);

      this.logger.log(`Store created with ID: ${savedStore.id} for admin: ${adminId}`);
      return savedStore;
    } catch (error) {
      this.logger.error(`Failed to create store: ${error.message}`);
      throw error;
    }
  }

  public async updateStore({
    adminId,
    storeId,
    updateData,
  }: IUpdateStoreParams): Promise<StoreEntity> {
    try {
      const admin = await this.adminRepository.findOne({
        where: { id: adminId },
        relations: ['store'],
      });

      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      if (!admin.store || admin.store.id !== storeId) {
        throw new UnauthorizedException('Admin can only update their own store');
      }

      if (updateData.phone) {
        const existingStoreByPhone = await this.storeRepository.findOne({
          where: { phone: updateData.phone, id: Not(storeId) },
        });

        if (existingStoreByPhone) {
          throw new ConflictException('Store with this phone already exists');
        }
      }

      if (updateData.email) {
        const existingStoreByEmail = await this.storeRepository.findOne({
          where: { email: updateData.email, id: Not(storeId) },
        });

        if (existingStoreByEmail) {
          throw new ConflictException('Store with this email already exists');
        }
      }

      await this.storeRepository.update(storeId, updateData);
      const updatedStore = await this.storeRepository.findOne({
        where: { id: storeId },
      });

      this.logger.log(`Store updated with ID: ${storeId} by admin: ${adminId}`);
      return updatedStore;
    } catch (error) {
      this.logger.error(`Failed to update store: ${error.message}`);
      throw error;
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  public async setWorkHours({
    adminId,
    storeId,
    workHours,
  }: ISetWorkHoursParams): Promise<StoreEntity> {
    try {
      this.validateWorkHours(workHours);

      const admin = await this.adminRepository.findOne({
        where: { id: adminId },
        relations: ['store'],
      });

      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      if (!admin.store || admin.store.id !== storeId) {
        throw new UnauthorizedException('Admin can only update their own store');
      }

      const store = await this.storeRepository.findOne({
        where: { id: storeId },
        relations: ['workHours'],
      });

      if (!store) {
        throw new NotFoundException('Store not found');
      }

      return await this.workHoursRepository.manager.transaction(
        async (transactionalEntityManager) => {
          if (store.workHours?.length) {
            await transactionalEntityManager.remove(store.workHours);
          }

          const workHoursEntities = workHours.map((wh) =>
            transactionalEntityManager.create(StoreWorkHoursEntity, {
              ...wh,
              store,
            }),
          );

          store.workHours = await transactionalEntityManager.save(
            StoreWorkHoursEntity,
            workHoursEntities,
          );

          store.workHours.forEach((wh) => {
            delete wh.store;
          });

          return store;
        },
      );
    } catch (error) {
      this.logger.error(`Failed to set work hours: ${error.message}`);
      throw error;
    }
  }

  public async publishStore({ adminId, storeId }: IPublishStoreParams): Promise<StoreEntity> {
    try {
      const admin = await this.adminRepository.findOne({
        where: { id: adminId },
        relations: ['store'],
      });

      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      if (!admin.store || admin.store.id !== storeId) {
        throw new UnauthorizedException('Admin can only publish their own store');
      }

      const store = await this.storeRepository.findOne({
        where: { id: storeId },
      });

      if (!store) {
        throw new NotFoundException('Store not found');
      }

      if (store.isActive) {
        throw new ConflictException('Store is already published');
      }

      store.isActive = true;
      const updatedStore = await this.storeRepository.save(store);

      this.logger.log(`Store published with ID: ${storeId} by admin: ${adminId}`);
      return updatedStore;
    } catch (error) {
      this.logger.error(`Failed to publish store: ${error.message}`);
      throw error;
    }
  }

  private validateWorkHours(
    workHours: Array<{
      dayOfWeek: number;
      isWorkingDay: boolean;
      openTime?: string;
      closeTime?: string;
    }>,
  ) {
    const uniqueDays = new Set(workHours.map((wh) => wh.dayOfWeek));

    if (uniqueDays.size !== workHours.length) {
      throw new BadRequestException('Duplicate days of week are not allowed');
    }

    for (const workHour of workHours) {
      if (workHour.isWorkingDay) {
        if (!workHour.openTime || !workHour.closeTime) {
          throw new BadRequestException(
            `Opening and closing times are required for working day ${workHour.dayOfWeek}`,
          );
        }

        const openTime = new Date(`1970-01-01T${workHour.openTime}`);
        const closeTime = new Date(`1970-01-01T${workHour.closeTime}`);

        if (openTime >= closeTime) {
          throw new BadRequestException(
            `Opening time must be before closing time for day ${workHour.dayOfWeek}`,
          );
        }
      } else {
        if (workHour.openTime || workHour.closeTime) {
          throw new BadRequestException(
            `Working hours should not be set for non-working day ${workHour.dayOfWeek}`,
          );
        }
      }
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  public async getStoreWithWorkHours(adminId: number): Promise<StoreEntity> {
    try {
      const admin = await this.adminRepository.findOne({
        where: { id: adminId },
        relations: ['store'],
      });

      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      if (!admin.store) {
        throw new NotFoundException('Store not found');
      }

      const store = await this.storeRepository.findOne({
        where: { id: admin.store.id },
        relations: ['workHours'],
      });

      return store;
    } catch (error) {
      this.logger.error(`Failed to get store with work hours: ${error.message}`);
      throw error;
    }
  }
}
