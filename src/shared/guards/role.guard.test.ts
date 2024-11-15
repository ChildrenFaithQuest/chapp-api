import { RoleGuard } from './role.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Permission, RoleType } from '@app-types/role.types';
import { mockRole } from '@app-root/mocks/role';
import { RoleService } from '@app-modules/role/services/role.service';

// Helper function to create mock execution context
function createMockExecutionContext({
  user,
}: {
  user: { $id: string };
}): ExecutionContext {
  return {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({ user }),
    }),
    getHandler: jest.fn(), // Mocking getHandler
    getClass: jest.fn(), // Optionally, you can also mock getClass
  } as unknown as ExecutionContext;
}

const mockRoleService = {
  getUserRolesAndPermissions: jest.fn(), // Mock the method you expect to call
};

describe('RoleGuard', () => {
  let roleGuard: RoleGuard;
  let reflector: Reflector;
  let roleService: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
        {
          provide: RoleService,
          useValue: mockRoleService, // Provide a mock RoleService
        },
      ],
    }).compile();

    roleGuard = module.get<RoleGuard>(RoleGuard);
    reflector = module.get<Reflector>(Reflector);
    roleService = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(roleGuard).toBeDefined();
  });

  it('should allow access if no roles or permissions are required', async () => {
    const mockContext = createMockExecutionContext({
      user: { $id: 'testId' },
    });

    // Mock that no roles or permissions are required for the route
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const result = await roleGuard.canActivate(mockContext);
    expect(result).toBe(true); // Access should be granted
  });

  it('should throw ForbiddenException if user does not have required role', async () => {
    const mockContext = createMockExecutionContext({
      user: { $id: 'testId' },
    });

    // Mock the required roles
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(['admin']);
    jest
      .spyOn(roleService, 'getUserRolesAndPermissions')
      .mockResolvedValueOnce({ roles: [mockRole.CHILD.name], permissions: [] });

    await expect(roleGuard.canActivate(mockContext)).rejects.toThrow(
      new ForbiddenException('User does not have the required role'),
    );
  });

  it('should throw ForbiddenException if user does not have required permissions', async () => {
    const mockContext = createMockExecutionContext({
      user: { $id: 'testId' },
    });

    // Mock the required permissions
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(undefined); // Roles are not required
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce([Permission.EDIT_PROFILE]);

    jest
      .spyOn(roleService, 'getUserRolesAndPermissions')
      .mockResolvedValueOnce({
        roles: [],
        permissions: [Permission.MANAGE_HOMEWORK],
      });

    await expect(roleGuard.canActivate(mockContext)).rejects.toThrow(
      new ForbiddenException('You do not have the necessary permissions.'),
    );
  });

  it('should allow access if user has the required roles and permissions', async () => {
    const mockContext = createMockExecutionContext({
      user: { $id: 'testId' },
    });

    // Mock required roles and permissions
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce(['admin']) // Roles
      .mockReturnValueOnce([Permission.MANAGE_USERS]); // Permissions;

    jest
      .spyOn(roleService, 'getUserRolesAndPermissions')
      .mockResolvedValueOnce({
        roles: [RoleType.ADMIN],
        permissions: [Permission.MANAGE_USERS],
      });

    const result = await roleGuard.canActivate(mockContext);
    expect(result).toBe(true); // Access should be granted
  });
});
