import 'tsconfig-paths/register';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

dotenv.config();

const isCompiled = __dirname.includes('dist');

// A function to create the DataSource dynamically
export const createAppDataSource = (
  configService?: ConfigService,
): DataSource => {
  const isTestEnvironment =
    (configService?.get<string>('NODE_ENV') ?? process.env.NODE_ENV) === 'test';

  return new DataSource({
    type: 'postgres',
    host: configService?.get<string>('DB_HOST') ?? process.env.DB_HOST,
    port: configService
      ? configService.get<number>('DB_PORT', 5432)
      : parseInt(process.env.DB_PORT || '5432', 10),
    username:
      configService?.get<string>('DB_USERNAME') ?? process.env.DB_USERNAME,
    password:
      configService?.get<string>('DB_PASSWORD') ?? process.env.DB_PASSWORD,
    database: configService?.get<string>('DB_NAME') ?? process.env.DB_NAME,
    entities: isCompiled
      ? ['dist/src/**/entities/*.entity.js'] // Only include .entity.js in dist
      : ['src/**/entities/*.entity.ts'], // Only include .entity.ts in src
    migrations: isCompiled
      ? ['dist/src/migrations/*.js']
      : ['src/migrations/*.ts'],
    synchronize: isTestEnvironment,
    dropSchema: isTestEnvironment,
  });
};

// Default AppDataSource for CLI usage
export const AppDataSource = createAppDataSource();
