import { TicketTierStatusEnum } from '@enums';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksRunner {
//   constructor(
//     @InjectRepository(TicketTierRepository)
//     private readonly ticketTierRepository: TicketTierRepository,
//     private readonly logger: Logger,
//   ) {}
//   @Cron(CronExpression.EVERY_DAY_AT_1AM)
//   public async updateTicketTierStatus() {
//     try {
//       const ticketTierIds = await this.ticketTierRepository.getTicketTiersIdsToUpdateStatus();

//       const { idsToActive, idsToInactive } = ticketTierIds;

//       if (idsToActive.length) {
//         await Promise.all(
//           idsToActive.map(async (id) => {
//             await this.ticketTierRepository.update(id, {
//               status: TicketTierStatusEnum.active,
//             });
//           }),
//         );
//       }

//       if (idsToInactive.length) {
//         await Promise.all(
//           idsToActive.map(async (id) => {
//             await this.ticketTierRepository.update(id, {
//               status: TicketTierStatusEnum.inactive,
//             });
//           }),
//         );
//       }

//       this.logger.log('updateTicketTierStatus cron is completed');
//     } catch (err) {
//       this.logger.error(err);
//     }
//   }
}
