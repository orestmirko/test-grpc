import { Module } from '@nestjs/common';
import { DatabaseModule } from '@core';
import { AdminModule, UserModule } from '@modules';
import { ScheduleModule } from '@nestjs/schedule';
import { CronTaskModule } from './cron';

@Module({
  imports: [DatabaseModule, CronTaskModule, ScheduleModule.forRoot(), AdminModule, UserModule],
})
export class AppModule {}
