import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  ZodExceptionFilter,
  BadRequestExceptionFilter,
} from './common/filters/zod-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ZodValidationPipe());

  // Add exception filters for consistent error formatting
  app.useGlobalFilters(
    new ZodExceptionFilter(),
    new BadRequestExceptionFilter(),
  );

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`FlavorAI Backend is running on: http://localhost:${port}/api`);
}
bootstrap();
