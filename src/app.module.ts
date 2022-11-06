import { Module } from '@nestjs/common';
import { DatabaseModule } from '@core';
import { TicketTierModule } from '@modules';
import { ScheduleModule } from '@nestjs/schedule';
import { CronTaskModule } from './cron';

@Module({
  imports: [
    DatabaseModule,
    TicketTierModule,
    CronTaskModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
