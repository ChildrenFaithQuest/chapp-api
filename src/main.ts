import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as tsConfigPaths from 'tsconfig-paths';
import { resolve } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

// Register the paths defined in tsconfig.json
tsConfigPaths.register({
  baseUrl: resolve(__dirname),
  paths: {
    '@app-shared/*': ['src/shared/*'],
    '@app-modules/*': ['src/modules/*'],
    '@app-types/*': ['src/types/*'],
    '@app-root/*': ['./*'],
  },
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Chapp Api')
    .setDescription('The Chapp API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('chapp')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
