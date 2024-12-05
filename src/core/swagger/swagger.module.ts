import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SwaggerInit = (app: NestFastifyApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Garden API')
    .setDescription('Garden API.')
    .setVersion('1.0')
    .addTag('Ticket-tier')
    .addServer('http://localhost:8000', 'Local server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
