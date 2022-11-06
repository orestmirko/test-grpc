import CONFIG from '@config';
import { lowercaseKeys } from '@utils';
const { MIGRATIONS_RUN, MIGRATIONS_DIR, ...rest } = CONFIG.DATABASE;

export = {
  ...lowercaseKeys(rest),
  migrationsRun: MIGRATIONS_RUN,
  cli: {
    migrationsDir: MIGRATIONS_DIR,
  },
};
