import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import CONFIG from '@config';
import { ExceptionsFilter, SwaggerInit } from '@core';

const { PORT, CORS_ALLOWED_ORIGINS } = CONFIG.APP;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.setGlobalPrefix('api');
  app.enableCors({ origin: CORS_ALLOWED_ORIGINS });
  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  SwaggerInit(app);
  await app.listen(PORT, () =>
    Logger.log(`Server is listening on port ${PORT}`),
  );
}
bootstrap();
