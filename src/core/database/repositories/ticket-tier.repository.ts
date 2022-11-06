import { TicketTierStatusEnum } from '@enums';
import * as moment from 'moment';
import { EntityRepository, Repository } from 'typeorm';
import { TicketTierEntity } from '../entities/ticket-tier.entity';

@EntityRepository(TicketTierEntity)
export class TicketTierRepository extends Repository<TicketTierEntity> {
  public async getTicketTiersIdsToUpdateStatus() {
    const currentTime = moment();

    const queryToActive: [{ id: string }] = await this.createQueryBuilder()
      .select('id')
      .where(':currentTime > sale_start AND :currentTime < sale_end', {
        currentTime,
      })
      .andWhere('status = :inactive', {
        inactive: TicketTierStatusEnum.inactive,
      })
      .execute();

    const queryToInactive: [{ id: string }] = await this.createQueryBuilder()
      .select('id')
      .where(':currentTime < sale_start AND :currentTime > sale_end', {
        currentTime,
      })
      .andWhere('status = :active', { active: TicketTierStatusEnum.active })
      .execute();

    return {
      idsToActive: queryToActive.map((item) => item.id),
      idsToInactive: queryToInactive.map((item) => item.id),
    };
  }
}
