import { DataSource } from 'typeorm';
import { TestingModule } from '@nestjs/testing';
import { UserType } from '@app-types/module.types';
import { Attendance } from '@app-modules/attendance/entities/attendance.entity';
import { Class } from '@app-modules/class/entities/class.entity';
import {
  closeTestModule,
  setupTestModule,
} from '@app-root/mocks/setupTestModule';
import { Child } from '@app-modules/user/entities/child.entity';
import { Parent } from '@app-modules/user/entities/parent.entity';
import { Teacher } from '@app-modules/user/entities/teacher.entity';
import { Auth } from './auth.entity';
import { Organization } from '@app-modules/organization/entities/organization.entity';

describe('Auth Entity', () => {
  let dataSource: DataSource;

  // Mock child data
  const mockAuth: Auth = {
    id: '4dca01c6-b834-4b47-88a1-c612dff74254',
    email: 'john.parent@example.com',
    password: 'password123',
    userType: UserType.PARENT,
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  };
  let module: TestingModule;

  beforeAll(async () => {
    module = await setupTestModule([
      Auth,
      Child,
      Parent,
      Attendance,
      Class,
      Organization,
      Teacher,
    ]);

    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await closeTestModule(module);
  });

  it('should create a Auth entity table with proper columns', async () => {
    const queryRunner = dataSource.createQueryRunner();
    const table = await queryRunner.getTable('auth');

    expect(table).toBeDefined();
    const idColumn = table?.findColumnByName('id');
    const email = table?.findColumnByName('email');
    const password = table?.findColumnByName('password');
    const genderColumn = table?.findColumnByName('userType');

    const createdAtColumn = table?.findColumnByName('createdAt');
    const updatedAtColumn = table?.findColumnByName('updatedAt');

    const parentColumn = table?.columns.find((col) => col.name === 'parentId');
    const childColumn = table?.columns.find((col) => col.name === 'childId');
    const teacherColumn = table?.columns.find(
      (col) => col.name === 'teacherId',
    );

    expect(idColumn).toBeDefined();
    expect(email).toBeDefined();
    expect(password).toBeDefined();
    expect(parentColumn).toBeDefined();
    expect(childColumn).toBeDefined();

    expect(teacherColumn).toBeDefined();
    expect(genderColumn).toBeDefined();
    expect(createdAtColumn).toBeDefined();
    expect(updatedAtColumn).toBeDefined();
  });

  it('should validate that Auth has all necessary fields constraints', async () => {
    const queryRunner = dataSource.createQueryRunner();
    const table = await queryRunner.getTable('auth');

    // Validate that certain constraints are set up properly
    const emailColumn = table?.findColumnByName('email');
    const userTypeColumn = table?.findColumnByName('userType');
    const parentColumn = table?.columns.find((col) => col.name === 'parentId');
    const childColumn = table?.columns.find((col) => col.name === 'childId');
    const teacherColumn = table?.columns.find(
      (col) => col.name === 'teacherId',
    );

    expect(emailColumn?.isUnique).toBe(true);
    expect(parentColumn?.isNullable).toBe(true);
    expect(childColumn?.isNullable).toBe(true);
    expect(teacherColumn?.isNullable).toBe(true);

    expect(userTypeColumn?.type).toBe('enum');
  });

  it('should save and retrieve a Auth entity successfully', async () => {
    const authRepository = dataSource.getRepository(Auth);

    const authEntity = authRepository.create(mockAuth);
    const savedAuth = await authRepository.save(authEntity);

    expect(savedAuth).toBeDefined();
    expect(savedAuth.id).toEqual(mockAuth.id);
    expect(savedAuth.email).toEqual(mockAuth.email);

    const foundAuth = await authRepository.findOneBy({ id: mockAuth.id });
    expect(foundAuth).toBeDefined();
  });

  it.skip('should handle entity validation on creation', async () => {
    const authRepository = dataSource.getRepository(Auth);

    const invalidAuth = authRepository.create({
      id: 'testInvalidID', // invalidid
      email: 'john.parent@example.com',
      password: 'password123',
      userType: UserType.PARENT,
    });

    try {
      await authRepository.save(invalidAuth);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
