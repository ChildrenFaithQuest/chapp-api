import { DataSource } from 'typeorm';
import { TestingModule } from '@nestjs/testing';
import { Attendance } from '@app-modules/attendance/entities/attendance.entity';
import { Class } from '@app-modules/class/entities/class.entity';
import { Church } from '@app-modules/church/entities/church.entity';
import {
  closeTestModule,
  setupTestModule,
} from '@app-root/mocks/setupTestModule';
import { Child } from '@app-modules/user/entities/child.entity';
import { Parent } from '@app-modules/user/entities/parent.entity';
import { Teacher } from '@app-modules/user/entities/teacher.entity';
import { mockChildren } from '@app-root/mocks/child';
import { mockClass } from '@app-root/mocks/class';
import { mockChurch } from '@app-root/mocks/church';

describe('Church Entity', () => {
  let dataSource: DataSource;
  let module: TestingModule;

  beforeAll(async () => {
    module = await setupTestModule([
      Child,
      Attendance,
      Class,
      Church,
      Parent,
      Teacher,
    ]);

    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await closeTestModule(module);
  });

  it('should create a Church entity table with proper columns', async () => {
    const queryRunner = dataSource.createQueryRunner();
    const table = await queryRunner.getTable('church');

    expect(table).toBeDefined();
    const idColumn = table?.findColumnByName('id');
    const name = table?.findColumnByName('name');
    const description = table?.findColumnByName('description');
    const address = table?.findColumnByName('address');

    const createdAtColumn = table?.findColumnByName('createdAt');
    const updatedAtColumn = table?.findColumnByName('updatedAt');
    expect(idColumn).toBeDefined();
    expect(name).toBeDefined();
    expect(description).toBeDefined();
    expect(address).toBeDefined();
    expect(createdAtColumn).toBeDefined();
    expect(updatedAtColumn).toBeDefined();
  });

  it('should save and retrieve a Church entity successfully', async () => {
    const classRepository = dataSource.getRepository(Class);
    const childRepository = dataSource.getRepository(Child);
    const churchRepository = dataSource.getRepository(Church);
    await classRepository.save(mockClass.FAITHFULNESS);
    await childRepository.save(mockChildren[0]);

    const churchEntity = churchRepository.create(mockChurch.A);
    const savedChurch = await churchRepository.save(churchEntity);

    expect(savedChurch).toBeDefined();
    expect(savedChurch.id).toEqual(mockChurch.A.id);
    expect(savedChurch.address).toEqual(mockChurch.A.address);

    const foundChurch = await churchRepository.findOneBy({
      id: mockChurch.A.id,
    });
    expect(foundChurch).toBeDefined();
  });

  it('should handle entity validation on creation', async () => {
    const repository = dataSource.getRepository(Church);

    const invalidAttendance = repository.create({
      id: 'testInvalidID', // invalidid
    });

    try {
      await repository.save(invalidAttendance);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
