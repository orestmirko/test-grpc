import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity, JoinColumn } from 'typeorm';
import { StoreEntity } from './store.entity';

@Entity('store_work_hours')
export class StoreWorkHoursEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    name: 'day_of_week',
    type: 'int',
    nullable: false,
    default: 0,
  })
  public dayOfWeek: number;

  @Column({
    name: 'open_time',
    type: 'time',
    nullable: false,
  })
  public openTime: string;

  @Column({
    name: 'close_time',
    type: 'time',
    nullable: false,
  })
  public closeTime: string;

  @ManyToOne(() => StoreEntity, (store) => store.workHours, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  public store: StoreEntity;
}
