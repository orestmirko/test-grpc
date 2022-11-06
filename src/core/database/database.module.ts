import CONFIG from '@config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { lowercaseKeys } from '@utils';
const { MIGRATIONS_RUN, MIGRATIONS_DIR, ...rest } = CONFIG.DATABASE;

const configuration = {
  ...lowercaseKeys(rest),
  migrationsRun: MIGRATIONS_RUN,
  cli: {
    migrationsDir: MIGRATIONS_DIR,
  },
};

export const DatabaseModule = TypeOrmModule.forRoot(configuration);
