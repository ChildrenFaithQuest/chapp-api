import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as tsConfigPaths from 'tsconfig-paths';
import { resolve } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

dotenv.config();

// Register the paths defined in tsconfig.json
tsConfigPaths.register({
  baseUrl: resolve(__dirname),
  paths: {
    '@user/*': ['src/modules/user'],
    '@attendance/*': ['src/modules/attendance/*'],
    '@class/*': ['src/modules/class/*'],
  },
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Chapp Api')
    .setDescription('The Chapp API description')
    .setVersion('1.0')
    .addTag('chapp')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3001);
}
bootstrap();
