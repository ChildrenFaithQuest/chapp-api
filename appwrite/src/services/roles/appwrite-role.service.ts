import { Injectable } from '@nestjs/common';
import { AppwriteClientService } from '../appwrite-client.service';
import { UserType } from '@app-types/module.types';
import { RoleType } from '@app-types/role.types';

@Injectable()
export class AppwriteRoleService {
  constructor(private readonly appwriteClientService: AppwriteClientService) {}

  // Map userType to roleName in Appwrite
  private userTypeToRoleMap: Record<UserType, RoleType> = {
    [UserType.PARENT]: RoleType.PARENT,
    [UserType.TEACHER]: RoleType.TEACHER,
    [UserType.CHILD]: RoleType.CHILD,
  };

  async getRoleIdByUserType(userType: UserType): Promise<string | null> {
    const database = this.appwriteClientService.getDatabaseService();
    const roleName = this.userTypeToRoleMap[userType];
    if (!roleName) {
      throw new Error(`Role for userType ${userType} not found`);
    }

    if (
      !process.env.APPWRITE_USER_ROLES_COLLECTION_ID ||
      !process.env.APPWRITE_DATABASE_ID
    ) {
      throw new Error(
        'USER_ROLES_COLLECTION_ID environment variable is not defined',
      );
    }

    try {
      const roleDocument = await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_USER_ROLES_COLLECTION_ID,
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
  // Function to assign a role to a user
  async assignRoleToUserByRoleName({
    userId,
    roleName,
  }: {
    userId: string;
    roleName: RoleType;
  }): Promise<void> {
    const database = this.appwriteClientService.getDatabaseService();
    const roleId = await this.getRoleIdByName(roleName);
    if (!roleId) {
      throw new Error(`Could not find roleId for role ${roleName}`);
    }

    try {
      if (
        !process.env.APPWRITE_USER_ROLES_COLLECTION_ID ||
        !process.env.APPWRITE_DATABASE_ID
      ) {
        throw new Error(
          'USER_ROLES_COLLECTION_ID environment variable is not defined',
        );
      }
      // Step 3: Create a document in the UserRoles collection to link the user with the role
      await database.createDocument(
        process.env.APPWRITE_DATABASE_ID, // The collection ID for user roles
        process.env.APPWRITE_USER_ROLES_COLLECTION_ID, // The collection ID for user roles
        'unique()', // Unique document ID
        {
          userId,
          roleId,
        },
      );
      console.log('Role assigned in UserRoles collection:', roleId);
    } catch (error) {
      console.error('Error assigning role to user:', error);
    }
  }

  async assignRoleToUserByUserType(
    userId: string,
    userType: UserType,
  ): Promise<void> {
    const database = this.appwriteClientService.getDatabaseService();

    const roleId = await this.getRoleIdByUserType(userType);
    if (!roleId) {
      throw new Error(`Could not find roleId for userType ${userType}`);
    }

    if (
      !process.env.APPWRITE_USER_ROLES_COLLECTION_ID ||
      !process.env.APPWRITE_DATABASE_ID
    ) {
      throw new Error(
        'USER_ROLES_COLLECTION_ID environment variable is not defined',
      );
    }

    try {
      const existingRoles = await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_USER_ROLES_COLLECTION_ID,
        [`userId=${userId}`, `roleId=${roleId}`],
      );

      if (existingRoles.total > 0) {
        console.log(`User ${userId} already has the role ${userType}`);
        return;
      }

      // Assign role by creating a document linking userId and roleId
      await database.createDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_USER_ROLES_COLLECTION_ID,
        'unique()',
        {
          userId,
          roleId,
        },
      );

      console.log(`Role ${roleId} assigned to user ${userId}`);
    } catch (error) {
      console.error('Error assigning role to user:', error);
      throw new Error('Could not assign role to user');
    }
  }

  async getRoleIdByName(roleName: RoleType): Promise<string | null> {
    const database = this.appwriteClientService.getDatabaseService();
    if (
      !process.env.APPWRITE_DATABASE_ID ||
      !process.env.APPWRITE_ROLES_COLLECTION_ID
    ) {
      throw new Error(
        'APPWRITE_PROJECT_ID or APPWRITE_ROLES_COLLECTION_ID environment variable is not defined',
      );
    }
    try {
      const roleDocument = await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_ROLES_COLLECTION_ID,
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
}
