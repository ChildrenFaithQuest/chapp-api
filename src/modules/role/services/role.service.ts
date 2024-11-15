import { AppwriteRoleService } from '@app-root/appwrite/src/services/roles/appwrite-role.service';
import { Permission, RoleType } from '@app-types/role.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
  constructor(private readonly appwriteRoleService: AppwriteRoleService) {}

  async getUserRoles(userId: string): Promise<{
    roleIds: string[];
    roles: RoleType[];
  }> {
    try {
      return await this.appwriteRoleService.fetchUserRoles(userId);
    } catch (error) {
      throw new Error(`Failed to get user roles: ${error.message}`);
    }
  }

  async getRoleIdByName(roleName: RoleType): Promise<string | null> {
    try {
      return await this.appwriteRoleService.fetchRoleIdByName(roleName);
    } catch (error) {
      throw new Error(`Failed to get role id by name: ${error.message}`);
    }
  }

  async getRolePermissions(roleId: string | string[]): Promise<string[]> {
    try {
      return await this.appwriteRoleService.fetchRolePermissions(roleId);
    } catch (error) {
      throw new Error(`Failed to get role permissions: ${error.message}`);
    }
  }

  async getUserRolesAndPermissions(roleId: string): Promise<{
    roles: RoleType[] | null;
    permissions: Permission[];
  }> {
    try {
      return await this.appwriteRoleService.fetchUserRolesAndPermissions(
        roleId,
      );
    } catch (error) {
      throw new Error(`Failed to get role permissions: ${error.message}`);
    }
  }
}
