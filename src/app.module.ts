import { Module } from '@nestjs/common';
import { DatabaseModule } from '@core';
import { AdminModule, StoreModule, UserModule } from '@modules';
import { ScheduleModule } from '@nestjs/schedule';
import { CronTaskModule } from './cron';

@Module({
  imports: [
    DatabaseModule,
    CronTaskModule,
    ScheduleModule.forRoot(),
    AdminModule,
    UserModule,
    StoreModule,
  ],
})
export class AppModule {}
