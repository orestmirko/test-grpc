import { TicketTierEntity } from '@entities';
import { ICreateTicketTier } from '@interfaces';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';

@Injectable()
export class TicketTierService {
  constructor(
    @InjectRepository(TicketTierEntity)
    private readonly ticketTierRepository: Repository<TicketTierEntity>,
    private readonly logger: Logger,
  ) {}

  public async getById(id: string): Promise<TicketTierEntity> {
    try {
      const ticketTier = await this.ticketTierRepository.findOne(id);

      if (!ticketTier) {
        throw new NotFoundException(
          `Ticket tier with id: ${id} does not exist`,
        );
      }

      return ticketTier;
    } catch (err) {
      this.logger.error(err);
    }
  }

  public create(
    data: ICreateTicketTier,
  ): Promise<ICreateTicketTier & TicketTierEntity> {
    try {
      const { sale_end, sale_start } = data;

      this._checkSaleTimeFrames(sale_start, sale_end);
      return this.ticketTierRepository.save(data);
    } catch (err) {
      this.logger.error(err);
    }
  }

  private _checkSaleTimeFrames(sale_start: Date, sale_end: Date) {
    const current = moment();

    const start = moment(sale_start);
    const end = moment(sale_end);

    if (start < current) {
      throw new BadRequestException(
        'sale_start to be greater than current time',
      );
    }

    if (start > end) {
      throw new BadRequestException('sale_end to be greater than sale_start');
    }
  }
}
