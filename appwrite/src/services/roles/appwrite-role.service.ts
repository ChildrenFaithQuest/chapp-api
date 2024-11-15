import { Injectable } from '@nestjs/common';
import { AppwriteClientService } from '../appwrite-client.service';
import { Permission, RoleType } from '@app-types/role.types';
import { AppwriteUserService } from '../users/appwrite-user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppwriteRoleService {
  private readonly databaseId: string;
  private readonly rolesCollectionId: string;
  private readonly permissionsCollectionId: string;
  private readonly rolePermissionsCollectionId: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly appwriteClientService: AppwriteClientService,
    private readonly appwriteUserService: AppwriteUserService,
  ) {
    this.databaseId =
      this.configService.get<string>('APPWRITE_DATABASE_ID') || '';
    this.rolesCollectionId =
      this.configService.get<string>('APPWRITE_ROLES_COLLECTION_ID') || '';
    this.permissionsCollectionId =
      this.configService.get<string>('APPWRITE_PERMISSIONS_COLLECTION_ID') ||
      '';
    this.rolePermissionsCollectionId =
      this.configService.get<string>(
        'APPWRITE_ROLE_PERMISSIONS_COLLECTION_ID',
      ) || '';
  }

  async getRoleIdByName(roleName: RoleType): Promise<string | null> {
    const database = this.appwriteClientService.getDatabaseService();
    try {
      const roleDocument = await database.listDocuments(
        this.databaseId,
        this.rolesCollectionId,
        [`name=${roleName}`],
      );

      if (roleDocument.total === 0) {
        throw new Error(`Role ${roleName} not found`);
      }

      const role = roleDocument.documents[0];
      return role.$id;
    } catch (error) {
      console.error('Error retrieving roleId:', error);
      return null;
    }
  }

  async getUserRoles(
    userId: string,
  ): Promise<{ roleIds: string[]; roles: RoleType[] }> {
    const database = this.appwriteClientService.getDatabaseService();
    try {
      const userProfile = await this.appwriteUserService.getUserProfile(userId);
      const roleIds = userProfile?.roleIds || []; // assuming `roleIds` is an array
      const roles = await Promise.all(
        roleIds.map(async (roleId: string) => {
          const role = await database.getDocument(
            this.databaseId,
            this.rolesCollectionId,
            roleId,
          );
          return role.name;
        }),
      );
      return { roleIds, roles };
    } catch (error) {
      console.error('Error fetching user roles:', error);
      throw new Error('Failed to retrieve user roles');
    }
  }

  async getUserRolesAndPermissions(
    userId: string,
  ): Promise<{ roles: RoleType[] | null; permissions: Permission[] }> {
    try {
      const { roleIds, roles } = await this.getUserRoles(userId);
      const permissions = await this.getUserPermissions(roleIds);
      return { roles, permissions };
    } catch (error) {
      console.error('Error fetching user roles and permissions:', error);
      throw new Error('Failed to retrieve user roles and permissions');
    }
  }

  async getUserPermissions(roleIds: string[]): Promise<Permission[]> {
    const database = this.appwriteClientService.getDatabaseService();
    if (roleIds.length === 0) return [];
    try {
      // Fetch role permissions
      const permissionIds = await Promise.all(
        roleIds.map(async (roleId: string) => {
          const result = await database.listDocuments(
            this.databaseId,
            this.rolePermissionsCollectionId,
            [`equal("roleId", "${roleId}")`],
          );
          return result.documents.map((doc) => doc.permissionId);
        }),
      );

      const uniquePermissionIds = [...new Set(permissionIds.flat())];

      // Fetch permission names
      const permissions = await Promise.all(
        uniquePermissionIds.map(async (permissionId: string) => {
          const permission = await database.getDocument(
            this.databaseId,
            this.permissionsCollectionId,
            permissionId,
          );
          return permission.name;
        }),
      );

      return permissions;
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      throw new Error('Failed to retrieve user permissions');
    }
  }
}
