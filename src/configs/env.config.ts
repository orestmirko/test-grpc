import * as dotenv from 'dotenv';
import { CONFIG_TYPES } from './config.type';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

export const config: CONFIG_TYPES = {
  APP: {
    PORT: parseInt(process.env.APP_PORT || '8000', 10),
    CORS_ALLOWED_ORIGINS: process.env.APP_CORS_ORIGINS?.split(',') || ['*'],
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  DATABASE: {
    TYPE: process.env.DATABASE_TYPE || 'postgres',
    HOST: process.env.DATABASE_HOST || 'localhost',
    PORT: parseInt(process.env.DATABASE_PORT || '5432', 10),
    USERNAME: process.env.DATABASE_USERNAME || 'garden',
    PASSWORD: process.env.DATABASE_PASSWORD || '123postgres',
    DATABASE: process.env.DATABASE_NAME || 'garden-dev',
    ENTITIES: ['dist/**/*.entity{.ts,.js}'],
    SYNCHRONIZE: process.env.DATABASE_SYNCHRONIZE === 'true',
    LOGGING: process.env.DATABASE_LOGGING === 'true',
    MIGRATIONS: ['dist/migrations/*.js'],
    MIGRATIONS_RUN: process.env.DATABASE_MIGRATIONS_RUN === 'true',
    MIGRATIONS_DIR: 'migrations',
  },
  REDIS: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
    TTL: parseInt(process.env.REDIS_TTL || '86400', 10),
  },
};

export default config;
