// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // permitir React
    credentials: true,
  });

  await app.listen(3000);
  console.log(' Backend escuchando en http://localhost:3000');
}
bootstrap();
