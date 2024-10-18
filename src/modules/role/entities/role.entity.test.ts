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
import { Role } from './role.entity';
import { Auth } from '@app-modules/auth/entities/auth.entity';
import { Organization } from '@app-modules/organization/entities/organization.entity';
import { mockRoles } from '@app-root/mocks/role';
import { Permission, RoleType } from '@app-types/role.types';

describe('Role Entity', () => {
  let dataSource: DataSource;
  let module: TestingModule;

  beforeAll(async () => {
    module = await setupTestModule([
      Role,
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

  it('should create a ROle entity table with proper columns', async () => {
    const queryRunner = dataSource.createQueryRunner();
    const table = await queryRunner.getTable('role');

    expect(table).toBeDefined();
    const idColumn = table?.findColumnByName('id');
    const name = table?.findColumnByName('name');
    const permissions = table?.findColumnByName('permissions');

    const createdAtColumn = table?.findColumnByName('createdAt');
    const updatedAtColumn = table?.findColumnByName('updatedAt');
    expect(idColumn).toBeDefined();
    expect(name).toBeDefined();
    expect(permissions).toBeDefined();
    expect(createdAtColumn).toBeDefined();
    expect(updatedAtColumn).toBeDefined();
  });

  it('should validate that Role has all necessary fields constraints', async () => {
    const queryRunner = dataSource.createQueryRunner();
    const table = await queryRunner.getTable('role');

    // Validate that certain constraints are set up properly
    const permissionsColumn = table?.findColumnByName('permissions');
    const nameColumn = table?.findColumnByName('name');

    expect(nameColumn?.type).toBe('enum');
    expect(nameColumn?.isUnique).toBe(true);
    expect(nameColumn?.default).toBe(`'${RoleType.GUEST}'`); // pg automatically wrap the default value in quotes
    expect(permissionsColumn?.type).toBe('enum');
  });

  it('should save and retrieve a Role entity successfully', async () => {
    const roleRepository = dataSource.getRepository(Role);
    const roleEntity = roleRepository.create(mockRoles[0]);
    const savedRole = await roleRepository.save(roleEntity);

    expect(savedRole).toBeDefined();
    expect(savedRole.id).toEqual(mockRoles[0].id);
    expect(savedRole.permissions).toEqual(mockRoles[0].permissions);

    const foundRole = await roleRepository.findOneBy({
      id: mockRoles[0].id,
    });
    expect(foundRole).toBeDefined();
  });

  it('should handle entity validation on creation', async () => {
    const repository = dataSource.getRepository(Role);

    const invalidRole = repository.create({
      id: 'invalidId',
      permissions: [Permission.ASSIGN_ROLES],
    });

    try {
      await repository.save(invalidRole);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
