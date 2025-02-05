import { Module } from '@nestjs/common';
import { DatabaseModule } from '@core';
import { PaymentsModule } from '@modules';
import { ScheduleModule } from '@nestjs/schedule';
import { CronTaskModule } from './cron';

@Module({
  imports: [
    DatabaseModule,
    CronTaskModule,
    ScheduleModule.forRoot(),
    PaymentsModule,
  ],
})
export class AppModule {}
