import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from '@entities';
import { PaymentStatus } from '@enums';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly repository: Repository<PaymentEntity>,
  ) {}

  async create(data: Partial<PaymentEntity>): Promise<PaymentEntity> {
    const payment = this.repository.create(data);
    return this.repository.save(payment);
  }

  async updateStatus(ids: number[], status: PaymentStatus): Promise<void> {
    await this.repository.update({ id: In(ids) }, { status });
  }

  async findByMerchantAndStatus(merchantId: number, statuses: PaymentStatus[]): Promise<PaymentEntity[]> {
    return this.repository.find({
      where: statuses.map(status => ({
        merchant: { id: merchantId },
        status
      })),
      order: { id: 'ASC' },
    });
  }
} 