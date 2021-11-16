import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as csurf from 'csurf';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TypeOrmExceptionFilter } from './common/filters/type-orm-exception.filter';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_PUBLIC_BUCKET_NAME_DEV'),
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter(), new TypeOrmExceptionFilter());
  await app.listen(3000);
  app.use(csurf());
}

bootstrap();
