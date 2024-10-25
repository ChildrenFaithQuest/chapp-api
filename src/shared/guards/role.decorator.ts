import { Permission, RoleType } from '@app-types/role.types';
import { SetMetadata } from '@nestjs/common';

// Constants to store metadata keys
export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';

// Roles decorator
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);

// Permissions decorator
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
