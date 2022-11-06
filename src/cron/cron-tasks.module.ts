import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketTierRepository } from '@repositories';
import { TasksRunner } from './cron-tasks.runner';

@Module({
  imports: [TypeOrmModule.forFeature([TicketTierRepository])],
  providers: [TasksRunner, Logger],
})
export class CronTaskModule {}
