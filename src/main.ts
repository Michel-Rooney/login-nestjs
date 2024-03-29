import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { AppModule } from './app.module';

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);

  const cors = {
    origin: ['http://localhost:8000'],
    methods: 'GET, HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  };

  app.enableCors(cors);
  await app.listen(8000);
}
bootstrap();
