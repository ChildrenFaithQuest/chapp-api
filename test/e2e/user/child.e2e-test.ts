import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@app-root/src/app.module';
import { mockChildData } from '@app-root/mocks/child';
import { DataSource } from 'typeorm';
import { Child } from '@app-modules/user/entities/child.entity';
import { UpdateChildDto } from '@app-modules/user/dtos/update-child.dto';

describe('ChildController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let childId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = app.get(DataSource);
    await app.init();

    // Add a test child directly to the database
    const childRepository = dataSource.getRepository(Child);
    const child = childRepository.create(mockChildData);
    const savedChild = await childRepository.save(child);
    childId = savedChild.id; // Save ID to use in the test
  });

  afterAll(async () => {
    await dataSource.dropDatabase(); // Clean up the test database
    await app.close();
  });

  it('/children (GET)- should retrieve all children', async () => {
    const response = await request(app.getHttpServer())
      .get('/children')
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/child/:id (GET) - should retrieve a single child by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/child/${childId}`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(childId);
    expect(response.body.lastName).toBe(mockChildData.lastName);
  });

  it('/child/:id (PATCH) - should retrieve a single child by ID', async () => {
    const updateChildDto: Partial<UpdateChildDto> = {
      firstName: 'New name',
    };
    const response = await request(app.getHttpServer())
      .patch(`/child/${childId}`)
      .send(updateChildDto)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(childId);
    expect(response.body.firstName).toBe(updateChildDto.firstName);
  });

  it('/child/:id (PUT) - should retrieve a single child by ID', async () => {
    const updateChildDto: Partial<UpdateChildDto> = {
      firstName: 'New name',
    };
    const response = await request(app.getHttpServer())
      .put(`/child/${childId}`)
      .send(updateChildDto)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(childId);
    expect(response.body.firstName).toBe(updateChildDto.firstName);
    expect(response.body.lastName).toBe(mockChildData.lastName);
  });
});
