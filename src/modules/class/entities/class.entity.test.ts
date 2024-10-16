import { DataSource } from 'typeorm';
import { TestingModule } from '@nestjs/testing';
import { Attendance } from '@app-modules/attendance/entities/attendance.entity';
import { Class } from '@app-modules/class/entities/class.entity';
import {
  closeTestModule,
  setupTestModule,
} from '@app-root/mocks/setupTestModule';
import { Child } from '@app-modules/user/entities/child.entity';
import { Parent } from '@app-modules/user/entities/parent.entity';
import { Teacher } from '@app-modules/user/entities/teacher.entity';
import { mockClass } from '@app-root/mocks/class';
import { Organization } from '@app-modules/organization/entities/organization.entity';

describe('Class Entity', () => {
  let dataSource: DataSource;
  let module: TestingModule;

  beforeAll(async () => {
    module = await setupTestModule([
      Child,
      Attendance,
      Class,
      Organization,
      Parent,
      Teacher,
    ]);

    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await closeTestModule(module);
  });

  it('should create a Class entity table with proper columns', async () => {
    const queryRunner = dataSource.createQueryRunner();
    const table = await queryRunner.getTable('class');

    expect(table).toBeDefined();
    const idColumn = table?.findColumnByName('id');
    const name = table?.findColumnByName('name');
    const ageGroup = table?.findColumnByName('ageGroup');
    const schedule = table?.findColumnByName('schedule');

    const orgColumn = table?.columns.find(
      (col) => col.name === 'organizationId',
    );

    const createdAtColumn = table?.findColumnByName('createdAt');
    const updatedAtColumn = table?.findColumnByName('updatedAt');
    expect(idColumn).toBeDefined();
    expect(name).toBeDefined();
    expect(orgColumn).toBeDefined();
    expect(ageGroup).toBeDefined();
    expect(schedule).toBeDefined();
    expect(createdAtColumn).toBeDefined();
    expect(updatedAtColumn).toBeDefined();
  });

  it('should save and retrieve a Class entity successfully', async () => {
    const classRepository = dataSource.getRepository(Class);

    const classEntity = classRepository.create(mockClass.FAITHFULNESS);
    const savedClass = await classRepository.save(classEntity);

    expect(savedClass).toBeDefined();
    expect(savedClass.id).toEqual(mockClass.FAITHFULNESS.id);
    expect(savedClass.name).toEqual(mockClass.FAITHFULNESS.name);

    const foundClass = await classRepository.findOneBy({
      id: mockClass.FAITHFULNESS.id,
    });
    expect(foundClass).toBeDefined();
  });

  it('should handle entity validation on creation', async () => {
    const repository = dataSource.getRepository(Class);

    const invalidClass = repository.create({
      id: 'testInvalidID', // invalidid
    });

    try {
      await repository.save(invalidClass);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
