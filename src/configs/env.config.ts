import { CONFIG_TYPES } from './config.type';
import { development } from './dev.config';
import { test } from './test.config';

const env: string = process.env.NODE_ENV || 'development';

const config: { [key: string]: CONFIG_TYPES } = {
  development,
  test,
};

export default config[env];
