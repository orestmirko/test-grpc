import { Logger, Module } from '@nestjs/common';
import { TicketTierController } from '@controllers';
import { TicketTierService } from '@providers';
import { TicketTierEntity } from '@entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TicketTierEntity])],
  controllers: [TicketTierController],
  providers: [TicketTierService, Logger],
})
export class TicketTierModule {}
