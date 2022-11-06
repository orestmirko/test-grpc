import { TicketTierStatusEnum } from '@enums';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ticket-tiers')
export class TicketTierEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    name: 'sale_start',
    type: 'timestamptz',
  })
  public sale_start: Date;

  @Column({
    name: 'sale_end',
    type: 'timestamptz',
  })
  public sale_end: Date;

  @Column({
    name: 'status',
    type: 'enum',
    default: TicketTierStatusEnum.inactive,
    enum: TicketTierStatusEnum,
  })
  public status: TicketTierStatusEnum;
}
