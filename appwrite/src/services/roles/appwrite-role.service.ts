import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
    @Inject(forwardRef(() => AppwriteUserService))
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

  async fetchRoleIdByName(roleName: RoleType): Promise<string | null> {
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

  async fetchUserRoles(
    userId: string,
  ): Promise<{ roleIds: string[]; roles: RoleType[] }> {
    const database = this.appwriteClientService.getDatabaseService();
    try {
      const userProfile = await this.appwriteUserService.getUserProfile(userId);
      const roleIds = userProfile?.roleIds || [];
      if (roleIds.length === 0) return { roleIds, roles: [] };
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

  async fetchUserPermissions(
    userId: string,
  ): Promise<{ permissionIds: string[]; permissions: Permission[] }> {
    const database = this.appwriteClientService.getDatabaseService();
    try {
      const userProfile = await this.appwriteUserService.getUserProfile(userId);
      const permissionIds = userProfile?.permissionIds || [];
      if (permissionIds.length === 0) return { permissionIds, permissions: [] };
      const permissions = await Promise.all(
        permissionIds.map(async (permissionId: string) => {
          const permission = await database.getDocument(
            this.databaseId,
            this.permissionsCollectionId,
            permissionId,
          );
          return permission.name;
        }),
      );
      return { permissionIds, permissions };
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      throw new Error('Failed to retrieve user permissions');
    }
  }

  async fetchUserRolesAndPermissions(
    userId: string,
  ): Promise<{ roles: RoleType[] | null; permissions: Permission[] }> {
    try {
      const { roleIds, roles } = await this.fetchUserRoles(userId);
      const rolePermissions = await this.fetchRolePermissions(roleIds);
      const userPermissions = await this.fetchUserPermissions(userId);
      const permissions = [...rolePermissions, ...userPermissions.permissions];
      return { roles, permissions };
    } catch (error) {
      console.error('Error fetching user roles and permissions:', error);
      throw new Error('Failed to retrieve user roles and permissions');
    }
  }

  async fetchRolePermissions(
    roleIds: string | string[],
  ): Promise<Permission[]> {
    const database = this.appwriteClientService.getDatabaseService();
    const roleIdsArray = Array.isArray(roleIds) ? roleIds : [roleIds];
    if (roleIdsArray.length === 0) return [];
    try {
      // Fetch role permissions
      const permissionIds = await Promise.all(
        roleIdsArray.map(async (roleId: string) => {
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
