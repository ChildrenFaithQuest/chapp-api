import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, EntitySchema } from 'typeorm';

export async function setupTestModule(
  // eslint-disable-next-line @typescript-eslint/ban-types
  entities: (Function | EntitySchema<any>)[],
): Promise<TestingModule> {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        database: process.env.DB_NAME, // Use in-memory database for testing
        entities: entities, // Entities to test
        synchronize: true, // Auto-sync schema
      }),
      TypeOrmModule.forFeature(entities), // Register repositories for the entities
    ],
  }).compile();

  return module;
}

export async function closeTestModule(module: TestingModule) {
  const dataSource: DataSource = module.get<DataSource>(getDataSourceToken());
  if (dataSource.isInitialized) {
    await dataSource.destroy(); // Close the DataSource after tests
  }
}
