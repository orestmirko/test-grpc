import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreEntity, AdminEntity } from '@entities';
import { CreateStoreDto } from '@dtos';

@Injectable()
export class StoreService {
  private readonly logger = new Logger(StoreService.name);

  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
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
}
