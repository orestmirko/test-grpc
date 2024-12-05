import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  public name: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 12,
    nullable: false,
    unique: true,
  })
  @Index('IDX_USER_PHONE')
  public phone: string;
}
