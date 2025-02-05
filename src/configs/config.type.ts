export interface CONFIG_TYPES {
  APP: {
    PORT: number;
    CORS_ALLOWED_ORIGINS: string[];
    FRONTEND_URL: string;
  };
  DATABASE: {
    TYPE: string;
    HOST: string;
    PORT: number;
    USERNAME: string;
    PASSWORD: string;
    DATABASE: string;
    SYNCHRONIZE: boolean;
    LOGGING: boolean;
    MIGRATIONS_RUN: boolean;
    ENTITIES: string[];
    MIGRATIONS: string[];
    MIGRATIONS_DIR: string;
  };
  REDIS: {
    HOST: string;
    PORT: number;
    TTL: number;
  };
}
