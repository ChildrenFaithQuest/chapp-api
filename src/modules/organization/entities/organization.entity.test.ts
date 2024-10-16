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
import { mockChildren } from '@app-root/mocks/child';
import { mockClass } from '@app-root/mocks/class';
import { Organization } from './organization.entity';
import { mockOrg } from '@app-root/mocks/organization';

describe('Organization Entity', () => {
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

  it('should create a Organization entity table with proper columns', async () => {
    const queryRunner = dataSource.createQueryRunner();
    const table = await queryRunner.getTable('organization');

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

  it('should save and retrieve a Organization entity successfully', async () => {
    const classRepository = dataSource.getRepository(Class);
    const childRepository = dataSource.getRepository(Child);
    const orgRepository = dataSource.getRepository(Organization);
    await classRepository.save(mockClass.FAITHFULNESS);
    await childRepository.save(mockChildren[0]);

    const orgEntity = orgRepository.create(mockOrg.A);
    const savedOrg = await orgRepository.save(orgEntity);

    expect(savedOrg).toBeDefined();
    expect(savedOrg.id).toEqual(mockOrg.A.id);
    expect(savedOrg.address).toEqual(mockOrg.A.address);

    const foundOrg = await orgRepository.findOneBy({
      id: mockOrg.A.id,
    });
    expect(foundOrg).toBeDefined();
  });

  it('should handle entity validation on creation', async () => {
    const repository = dataSource.getRepository(Organization);

    const invalidOrg = repository.create({
      id: 'testInvalidID', // invalidid
    });

    try {
      await repository.save(invalidOrg);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
