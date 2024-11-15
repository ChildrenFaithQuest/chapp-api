import { Permission, RoleType } from '@app-types/role.types';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, ROLES_KEY } from './role.decorator';
import { CustomRequest } from '@app-types/express-request.types';
import { AppwriteRoleService } from '@app-root/appwrite/src/services/roles/appwrite-role.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly appwriteRoleService: AppwriteRoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles && !requiredPermissions) {
      return true; // No roles or permissions are required
    }

    const request: CustomRequest = context.switchToHttp().getRequest();
    const userId = request.user?.$id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated.');
    }

    try {
      const { roles, permissions } =
        await this.appwriteRoleService.getUserRolesAndPermissions(userId);
      const hasRole =
        roles?.some((role) => requiredRoles.includes(role)) ?? false;

      if (!hasRole) {
        throw new ForbiddenException(
          'You do not have the necessary permissions or roles.',
        );
      }

      const hasPermission = requiredPermissions.some((permission) =>
        permissions.includes(permission),
      );

      if (!hasPermission) {
        throw new ForbiddenException(
          'You do not have the necessary permissions.',
        );
      }

      return hasRole && hasPermission;
    } catch (error) {
      console.error('Error in RoleGuard:', error);
      throw new ForbiddenException('Access denied.');
    }
  }
}
