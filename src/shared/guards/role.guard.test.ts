import { RoleGuard } from './role.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@app-modules/role/entities/role.entity';
import { Permission } from '@app-types/role.types';
import { mockRole } from '@app-root/mocks/role';

// Helper function to create mock execution context
function createMockExecutionContext({
  user,
}: {
  user: { roles: Role[] };
}): ExecutionContext {
  return {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({ user }),
    }),
    getHandler: jest.fn(), // Mocking getHandler
    getClass: jest.fn(), // Optionally, you can also mock getClass
  } as unknown as ExecutionContext;
}

describe('RoleGuard', () => {
  let roleGuard: RoleGuard;
  let reflector: Reflector;

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
      ],
    }).compile();

    roleGuard = module.get<RoleGuard>(RoleGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(roleGuard).toBeDefined();
  });

  it('should allow access if no roles or permissions are required', async () => {
    const mockContext = createMockExecutionContext({
      user: { roles: [] },
    });

    // Mock that no roles or permissions are required for the route
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const result = await roleGuard.canActivate(mockContext);
    expect(result).toBe(true); // Access should be granted
  });

  it('should throw ForbiddenException if user does not have required role', async () => {
    const mockContext = createMockExecutionContext({
      user: {
        roles: [mockRole.CHILD],
      },
    });

    // Mock the required roles
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(['admin']);

    await expect(roleGuard.canActivate(mockContext)).rejects.toThrow(
      new ForbiddenException('User does not have the required role'),
    );
  });

  it('should throw ForbiddenException if user does not have required permissions', async () => {
    const mockContext = createMockExecutionContext({
      user: { roles: [mockRole.ADMIN] },
    });

    // Mock the required permissions
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(undefined); // Roles are not required
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce([Permission.EDIT_PROFILE]);

    await expect(roleGuard.canActivate(mockContext)).rejects.toThrow(
      new ForbiddenException('You do not have the necessary permissions.'),
    );
  });

  it('should allow access if user has the required roles and permissions', async () => {
    const mockContext = createMockExecutionContext({
      user: { roles: [mockRole.ADMIN] },
    });

    // Mock required roles and permissions
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce(['admin']) // Roles
      .mockReturnValueOnce([Permission.MANAGE_USERS]); // Permissions;

    const result = await roleGuard.canActivate(mockContext);
    expect(result).toBe(true); // Access should be granted
  });
});
