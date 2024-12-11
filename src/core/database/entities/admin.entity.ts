import { BaseEntity, StoreEntity } from '@entities';
import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';

@Entity('admins')
export class AdminEntity extends BaseEntity {
  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  public email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  public password: string;

  @OneToOne(() => StoreEntity)
  @JoinColumn({ name: 'store_id' })
  public store: StoreEntity;
} 