import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as express from 'express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { config } from './common/config/config';
import { winstonConfig } from './shared/logger/winston.logger';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';

async function bootstrap() {
  const logger =  WinstonModule.createLogger(winstonConfig)
  const app = await NestFactory.create(AppModule, { logger });

  app.setGlobalPrefix('api/v1');

  app.use(helmet());

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  const configuration = new DocumentBuilder()
    .setTitle('PR AI AGENT')
    .setDescription('AI AGENT')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .addTag('AI AGENT')
    .setExternalDoc('Postman Collection', '/api-json')
    .build();

  const document = SwaggerModule.createDocument(app, configuration);
  SwaggerModule.setup('/docs', app, document);

  const appPort = config.app.port;

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(appPort, () => {
    logger.log(
      ` 
     ------------------------------------------
     Server Application Started!
     API V1: http://localhost:${appPort}/api/v1/
     API Docs: http://localhost:${appPort}/docs
     Pr ai agent started successfully
     ------------------------------------------
    `
    );
  });
}

bootstrap();

