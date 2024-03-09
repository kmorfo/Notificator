import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});
  const logger = new Logger('Bootstrap');

  //Modulos para las valicaciónes
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
  }));

  await app.listen( process.env.PORT);
  logger.log(`App is running on port ${process.env.PORT}`);
}
bootstrap();
