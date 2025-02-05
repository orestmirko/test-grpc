import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('merchants')
export class MerchantEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'numeric', default: 0 })
  commissionPercent: number;
}
