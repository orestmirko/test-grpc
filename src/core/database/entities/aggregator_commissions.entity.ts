import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('aggregator_commissions')
export class AggregatorCommissionsEntity extends BaseEntity {
  @Column({ type: 'numeric', default: 0 })
  fixedFee: number;

  @Column({ type: 'numeric', default: 0 })
  percentFee: number;

  @Column({ type: 'numeric', default: 0 })
  holdPercent: number;
}
