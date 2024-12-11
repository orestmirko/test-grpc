import { StoreEntity } from '@entities';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity, JoinColumn } from 'typeorm';

@Entity('store_work_hours')
export class StoreWorkHoursEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'int', nullable: false })
  public dayOfWeek: number;

  @Column({ type: 'time', nullable: false })
  public openTime: string;

  @Column({ type: 'time', nullable: false })
  public closeTime: string;

  @ManyToOne(() => StoreEntity, (store) => store.workHours, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  public store: StoreEntity;
}
