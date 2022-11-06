import { CreateTicketTierDto } from '@dtos';
import { TicketTierEntity } from '@entities';
import { TicketTierService } from '@providers';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Ticket-tier')
@Controller('ticker-tier')
export class TicketTierController {
  constructor(private readonly ticketTierService: TicketTierService) {}

  @Post()
  public create(@Body() data: CreateTicketTierDto): Promise<TicketTierEntity> {
    return this.ticketTierService.create(data);
  }

  @Get(':id')
  public getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TicketTierEntity> {
    return this.ticketTierService.getById(id);
  }
}
