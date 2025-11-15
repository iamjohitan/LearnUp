import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { connectMongo } from './infra/mongo.client';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);

  app.use(helmet());
  app.enableCors();

  await connectMongo();

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Servidor corriendo en http:localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
