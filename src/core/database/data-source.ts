import { DataSource } from 'typeorm';
import { config } from '../../configs/env.config';
import { lowercaseKeys } from '../../utils/lowercase-keys.util';

const { MIGRATIONS_RUN, MIGRATIONS_DIR, ...rest } = config.DATABASE;

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...lowercaseKeys(rest),
  migrationsRun: MIGRATIONS_RUN,
  migrations: [`${process.cwd()}/${MIGRATIONS_DIR}/*.{ts,js}`],
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
});
