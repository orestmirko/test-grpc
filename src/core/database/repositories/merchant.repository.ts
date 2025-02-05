import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantEntity } from '@entities';
import { CreateMerchantDto } from '@dtos';

@Injectable()
export class MerchantRepository {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly repository: Repository<MerchantEntity>,
  ) {}

  async findById(id: number): Promise<MerchantEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: CreateMerchantDto): Promise<MerchantEntity> {
    const merchant = this.repository.create(data);
    return this.repository.save(merchant);
  }
} 