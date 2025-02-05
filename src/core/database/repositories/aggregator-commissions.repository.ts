import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AggregatorCommissionsEntity } from '@entities';
import { ICommission } from '@interfaces';

@Injectable()
export class AggregatorCommissionsRepository {
  constructor(
    @InjectRepository(AggregatorCommissionsEntity)
    private readonly repository: Repository<AggregatorCommissionsEntity>,
  ) {}

  async findOne(): Promise<AggregatorCommissionsEntity | null> {
    return this.repository.findOne({
      order: { createdAt: 'DESC' },
    });
  }

  async save(commission: AggregatorCommissionsEntity): Promise<AggregatorCommissionsEntity> {
    return this.repository.save(commission);
  }

  async create(data: ICommission): Promise<AggregatorCommissionsEntity> {
    return this.repository.create(data);
  }
} 