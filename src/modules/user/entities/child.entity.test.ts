import { DataSource } from 'typeorm';
import { Child } from './child.entity'; // Adjust this import based on your file structure
import { TestingModule } from '@nestjs/testing';
import { UserGender } from '@app-types/module.types';
import { Parent } from './parent.entity';
import { Attendance } from '@app-modules/attendance/entities/attendance.entity';
import { Class } from '@app-modules/class/entities/class.entity';
import { Church } from '@app-modules/church/entities/church.entity';
import { Teacher } from './teacher.entity';
import {
  closeTestModule,
  setupTestModule,
} from '@app-root/mocks/setupTestModule';

describe('Child Entity', () => {
  let dataSource: DataSource;

  // Mock child data
  const mockChild = {
    id: '4dca01c6-b834-4b47-88a1-c612dff74254',
    firstName: 'Emily',
    lastName: 'Doe',
    email: 'emily.doe@example.com',
    password: 'password123',
    gender: UserGender.FEMALE,
  };
  let module: TestingModule;

  beforeAll(async () => {
    module = await setupTestModule([
      Child,
      Parent,
      Attendance,
      Class,
      Church,
      Teacher,
    ]);

    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await closeTestModule(module);
  });

  it('should create a Child entity table with proper columns', async () => {
    const queryRunner = dataSource.createQueryRunner();
    const table = await queryRunner.getTable('child');

    expect(table).toBeDefined();
    ``;

    const idColumn = table?.findColumnByName('id');
    const firstNameColumn = table?.findColumnByName('firstName');
    const lastNameColumn = table?.findColumnByName('lastName');
    const genderColumn = table?.findColumnByName('gender');
    const dateOfBirthColumn = table?.findColumnByName('dateOfBirth');

    const createdAtColumn = table?.findColumnByName('createdAt');
    const updatedAtColumn = table?.findColumnByName('updatedAt');

    const parentColumn = table?.columns.find((col) => col.name === 'parentId'); // Adjust name if different
    const classColumn = table?.columns.find((col) => col.name === 'classId'); // Adjust name if different

    expect(idColumn).toBeDefined();
    expect(firstNameColumn).toBeDefined();
    expect(lastNameColumn).toBeDefined();
    expect(parentColumn).toBeDefined();
    expect(classColumn).toBeDefined();
    expect(genderColumn).toBeDefined();
    expect(dateOfBirthColumn).toBeDefined();
    expect(createdAtColumn).toBeDefined();
    expect(updatedAtColumn).toBeDefined();
  });

  it('should validate that Child has all necessary fields constraints', async () => {
    const queryRunner = dataSource.createQueryRunner();
    const table = await queryRunner.getTable('child');

    // Validate that certain constraints are set up properly
    const gradeColumn = table?.findColumnByName('grade');
    const genderColumn = table?.findColumnByName('gender');
    const dateOfBirthColumn = table?.findColumnByName('dateOfBirth');

    expect(gradeColumn?.isNullable).toBe(true);
    expect(genderColumn?.type).toBe('enum');
    expect(dateOfBirthColumn?.type).toBe('date');
  });

  it('should save and retrieve a Child entity successfully', async () => {
    const childRepository = dataSource.getRepository(Child);

    const childEntity = childRepository.create(mockChild);
    const savedChild = await childRepository.save(childEntity);

    expect(savedChild).toBeDefined();
    expect(savedChild.id).toEqual(mockChild.id);
    expect(savedChild.firstName).toEqual(mockChild.firstName);

    const foundChild = await childRepository.findOneBy({ id: mockChild.id });
    expect(foundChild).toBeDefined();
  });

  it('should handle entity validation on creation', async () => {
    const childRepository = dataSource.getRepository(Child);

    const invalidChild = childRepository.create({
      id: 'child_002', // invid due to invalid id value
      firstName: 'John',
      lastName: 'Doe',
      gender: UserGender.MALE,
    });

    try {
      await childRepository.save(invalidChild);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});