import { Auth } from '@app-modules/auth/entities/auth.entity';
import { Role } from '@app-modules/role/entities/role.entity';
import { Permission, RoleType } from '@app-types/role.types';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, ROLES_KEY } from './role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

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

    const request = context.switchToHttp().getRequest();
    const user: Auth = request.user;

    if (!user || !user.roles) {
      throw new ForbiddenException(
        'You do not have the necessary permissions or roles.',
      );
    }

    const hasRole = requiredRoles
      ? user.roles.some((role) => requiredRoles.includes(role.name))
      : true;

    if (!hasRole) {
      throw new ForbiddenException('User does not have the required role');
    }

    // Flatten the user's roles and their permissions
    const userPermissions = user.roles.flatMap(
      (role: Role) => role.permissions,
    );

    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have the necessary permissions.',
      );
    }

    // return hasRole && hasPermission;

    return hasPermission;
  }
}
