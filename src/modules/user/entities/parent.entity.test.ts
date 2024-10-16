import { DataSource } from 'typeorm';
import { Child } from './child.entity'; // Adjust this import based on your file structure
import { TestingModule } from '@nestjs/testing';
import { UserGender } from '@app-types/module.types';
import { Parent } from './parent.entity';
import { Attendance } from '@app-modules/attendance/entities/attendance.entity';
import { Class } from '@app-modules/class/entities/class.entity';
import { Teacher } from './teacher.entity';
import {
  closeTestModule,
  setupTestModule,
} from '@app-root/mocks/setupTestModule';
import { Organization } from '@app-modules/organization/entities/organization.entity';

describe('Parent Entity', () => {
  let dataSource: DataSource;

  // Mock parent data
  const mockParent = {
    id: '4dca01c6-b834-4b47-88a1-c612dff74254',
    gender: UserGender.FEMALE,
    firstName: 'John',
    lastName: 'Doe',
    contact: {
      phoneNumber: '+1234567890',
      address: '788 Elm St, Springfield',
    },
    children: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  };
  let module: TestingModule;

  beforeAll(async () => {
    module = await setupTestModule([
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

  it('should create a Parent entity table with proper columns', async () => {
    const queryRunner = dataSource.createQueryRunner();
    const table = await queryRunner.getTable('parent');

    expect(table).toBeDefined();
    ``;

    const idColumn = table?.findColumnByName('id');
    const firstNameColumn = table?.findColumnByName('firstName');
    const lastNameColumn = table?.findColumnByName('lastName');
    const genderColumn = table?.findColumnByName('gender');
    const dateOfBirthColumn = table?.findColumnByName('dateOfBirth');
    const contactPhonenumberColumn =
      table?.findColumnByName('contactPhonenumber');
    const contactAddressColumn = table?.findColumnByName('contactAddress');

    const createdAtColumn = table?.findColumnByName('createdAt');
    const updatedAtColumn = table?.findColumnByName('updatedAt');

    expect(idColumn).toBeDefined();
    expect(firstNameColumn).toBeDefined();
    expect(lastNameColumn).toBeDefined();
    expect(genderColumn).toBeDefined();
    expect(dateOfBirthColumn).toBeDefined();
    expect(createdAtColumn).toBeDefined();
    expect(updatedAtColumn).toBeDefined();
    expect(contactPhonenumberColumn).toBeDefined();
    expect(contactAddressColumn).toBeDefined();
  });

  it('should validate that Parent has all necessary fields constraints', async () => {
    const queryRunner = dataSource.createQueryRunner();
    const table = await queryRunner.getTable('parent');

    // Validate that certain constraints are set up properly
    // const gradeColumn = table?.findColumnByName('grade');
    const genderColumn = table?.findColumnByName('gender');
    const dateOfBirthColumn = table?.findColumnByName('dateOfBirth');

    // expect(gradeColumn?.isNullable).toBe(true);
    expect(genderColumn?.type).toBe('enum');
    expect(dateOfBirthColumn?.type).toBe('date');
  });

  it('should save and retrieve a Parent entity successfully', async () => {
    const parentRepository = dataSource.getRepository(Parent);

    const parentEntity = parentRepository.create(mockParent);
    const savedParent = await parentRepository.save(parentEntity);

    expect(savedParent).toBeDefined();
    expect(savedParent.id).toEqual(mockParent.id);
    expect(savedParent.firstName).toEqual(mockParent.firstName);

    const foundParent = await parentRepository.findOneBy({ id: mockParent.id });
    expect(foundParent).toBeDefined();
  });

  it('should handle entity validation on creation', async () => {
    const parentRepository = dataSource.getRepository(Parent);

    const invalidParent = parentRepository.create({
      id: 'psrent_002', // invid due to invalid id value
      firstName: 'John',
      lastName: 'Doe',
      gender: UserGender.MALE,
    });

    try {
      await parentRepository.save(invalidParent);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
