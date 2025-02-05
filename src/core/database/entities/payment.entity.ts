import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { MerchantEntity } from './merchant.entity';
import { PaymentStatus } from '@enums';
import { BaseEntity } from './base.entity';

@Entity('payments')
export class PaymentEntity extends BaseEntity {
  @ManyToOne(() => MerchantEntity, { eager: true })
  merchant: MerchantEntity;

  @Index('IDX_PAYMENT_AMOUNT')
  @Column({ type: 'numeric' })
  amount: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.ACCEPTED })
  status: PaymentStatus;

  @Column({ type: 'numeric', default: 0 })
  netAmount: number;

  @Column({ type: 'numeric', default: 0 })
  holdAmount: number;
}
