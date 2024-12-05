import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksRunner } from './cron-tasks.runner';

@Module({
  imports: [],
  providers: [TasksRunner, Logger],
})
export class CronTaskModule {}
