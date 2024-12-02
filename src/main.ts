import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // whitelist removes the  extra data passed to request body
  app.useGlobalPipes(new ValidationPipe({whitelist: true}))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
