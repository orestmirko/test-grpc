import { Module } from '@nestjs/common';
import { DatabaseModule } from '@core';
import { UserModule } from '@modules';
import { ScheduleModule } from '@nestjs/schedule';
import { CronTaskModule } from './cron';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    CronTaskModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
