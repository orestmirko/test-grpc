import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: configService.get('GRPC_URL'),
      package: configService.get('GRPC_PACKAGE'),
      protoPath: configService.get('GRPC_PROTO_PATH'),
    },
  });

  await microservice.listen();
}
bootstrap();
