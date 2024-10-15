import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globlaPrefix = 'api/v1';

  app.setGlobalPrefix(globlaPrefix);

  const config = new DocumentBuilder()
    .setTitle('Practica_3 API')
    .setDescription('Endpoints API REST para la aplicacion de la Practica 3')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globlaPrefix}/docs`, app, document);

  app.use(morgan('dev')); // log every request to the console

  app.enableCors({
    origin: true,
    credentials: true,
  });

  console.log(process.env.PORT);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
