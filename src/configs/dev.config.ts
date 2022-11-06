import { CONFIG_TYPES } from './config.type';

export const development: CONFIG_TYPES = {
  APP: {
    PORT: 8000,
    CORS_ALLOWED_ORIGINS: ['*'],
  },
  DATABASE: {
    TYPE: 'postgres',
    HOST: 'localhost',
    PORT: 5432,
    USERNAME: 'postgres',
    PASSWORD: 'postgres',
    DATABASE: 'test-project',
    ENTITIES: ['dist/**/*.entity{.ts,.js}'],
    SYNCHRONIZE: false,
    LOGGING: true,
    MIGRATIONS: ['dist/migrations/*.js'],
    MIGRATIONS_RUN: false,
    MIGRATIONS_DIR: 'migrations',
  },
};
