import { Column, Entity, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoreWorkHoursEntity } from '@entities';

@Entity('stores')
export class StoreEntity extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  @Index()
  public name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public logoUrl: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  public description: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 12,
    nullable: false,
    unique: true,
  })
  public phone: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  public email: string;

  @Column({
    name: 'website',
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  public website: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public street: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  @Index()
  public city: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  @Index()
  public region: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    nullable: true,
  })
  public latitude: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    nullable: true,
  })
  public longitude: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  @Index()
  public isCityDeliveryAvailable: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public instagramUrl: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public tiktokUrl: string;

  @OneToMany(() => StoreWorkHoursEntity, (workHours) => workHours.store, { cascade: true })
  public workHours: StoreWorkHoursEntity[];
}
