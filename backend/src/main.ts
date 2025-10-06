import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permitir que tu frontend en localhost:5173 (Vite) haga solicitudes
  app.enableCors({ origin: 'http://localhost:5173' });

  await app.listen(3000);
  console.log('Backend escuchando en http://localhost:3000');
}
bootstrap();
