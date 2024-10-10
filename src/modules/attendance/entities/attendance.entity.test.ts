import { DataSource } from 'typeorm';
import { TestingModule } from '@nestjs/testing';
import { AttendanceStatus } from '@app-types/module.types';
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

describe('Attendance Entity', () => {
  let dataSource: DataSource;

  // Mock child data
  const mockAttendance = {
    id: '4dca01c6-b834-4b47-88a1-c612dff74254',
    status: AttendanceStatus.ABSENT,
    date: '2021-10-12',
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
    child: mockChildren[0],
    class: mockClass.FAITHFULNESS,
  };
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

  it('should create an Attendance entity table with proper columns', async () => {
    const queryRunner = dataSource.createQueryRunner();
    const table = await queryRunner.getTable('attendance');

    expect(table).toBeDefined();
    const idColumn = table?.findColumnByName('id');
    const status = table?.findColumnByName('status');

    const createdAtColumn = table?.findColumnByName('createdAt');
    const updatedAtColumn = table?.findColumnByName('updatedAt');

    const parentColumn = table?.columns.find((col) => col.name === 'classId');
    const childColumn = table?.columns.find((col) => col.name === 'childId');

    expect(idColumn).toBeDefined();
    expect(status).toBeDefined();
    expect(parentColumn).toBeDefined();
    expect(childColumn).toBeDefined();
    expect(createdAtColumn).toBeDefined();
    expect(updatedAtColumn).toBeDefined();
  });

  it.skip('should validate that Attendance has all necessary fields constraints', async () => {
    const queryRunner = dataSource.createQueryRunner();
    const table = await queryRunner.getTable('attendance');

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

  it.skip('should save and retrieve a Attendance entity successfully', async () => {
    const repository = dataSource.getRepository(Attendance);

    const attendanceEntity = repository.create(mockAttendance);
    const savedAttendance = await repository.save(attendanceEntity);

    expect(savedAttendance).toBeDefined();
    expect(savedAttendance.id).toEqual(mockAttendance.id);
    expect(savedAttendance.status).toEqual(mockAttendance.status);

    const foundAttendance = await repository.findOneBy({
      id: mockAttendance.id,
    });
    expect(foundAttendance).toBeDefined();
  });

  it.skip('should handle entity validation on creation', async () => {
    const repository = dataSource.getRepository(Attendance);

    const invalidAttendance = repository.create({
      id: 'testInvalidID', // invalidid
      status: AttendanceStatus.ABSENT,
    });

    try {
      await repository.save(invalidAttendance);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
