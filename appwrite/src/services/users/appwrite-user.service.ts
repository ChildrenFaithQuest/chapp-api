import { Injectable } from '@nestjs/common';
import { AppwriteClientService } from '../appwrite-client.service';
import { UserType } from '@app-types/module.types';
import { RoleType } from '@app-types/role.types';
import { AppwriteRoleService } from '../roles/appwrite-role.service';
import { Models } from 'node-appwrite';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppwriteUserService {
  private readonly databaseId: string;
  private readonly userProfileCollectionId: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly appwriteClientService: AppwriteClientService,
    private readonly appwriteRoleService: AppwriteRoleService,
  ) {
    this.databaseId =
      this.configService.get<string>('APPWRITE_DATABASE_ID') || '';
    this.userProfileCollectionId =
      this.configService.get<string>('APPWRITE_USER_PROFILE_COLLECTION_ID') ||
      '';
  }
  // Map userType to roleName in Appwrite
  private userTypeToRoleMap: Record<UserType, RoleType> = {
    [UserType.PARENT]: RoleType.PARENT,
    [UserType.TEACHER]: RoleType.TEACHER,
    [UserType.CHILD]: RoleType.CHILD,
  };
  // Get user details
  async getUserDetails() {
    const account = this.appwriteClientService.getAccountService();
    try {
      const response = await account.get();
      return response;
    } catch (error) {
      throw new Error(`Failed to get user details: ${error.message}`);
    }
  }

  async setUserProfile(userType: UserType, userId: string): Promise<void> {
    const database = this.appwriteClientService.getDatabaseService();
    const roleName = this.userTypeToRoleMap[userType];
    const roleId = await this.appwriteRoleService.getRoleIdByName(roleName);
    try {
      await database.createDocument(
        this.databaseId, // Database ID in Appwrite
        this.userProfileCollectionId, // Collection ID
        'unique()', // Unique document ID
        { userId, userType, roleIds: [roleId] }, // Document data
      );
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Error creating user');
    }
  }

  async getUserType(userId: string): Promise<UserType | null> {
    const database = this.appwriteClientService.getDatabaseService();
    try {
      const userProfile = await database.listDocuments(
        this.databaseId, // Database ID in Appwrite
        this.userProfileCollectionId, // Collection ID
        [`userId=${userId}`], // Filter to match the userId
      );

      return userProfile.documents.length
        ? userProfile.documents[0].userType
        : null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Error fetching user profile:');
    }
  }

  async getUserProfile(userId: string): Promise<Models.Document | null> {
    const database = this.appwriteClientService.getDatabaseService();
    try {
      const userProfile = await database.listDocuments(
        this.databaseId, // Database ID in Appwrite
        this.userProfileCollectionId, // Collection ID
        [`userId=${userId}`], // Filter to match the userId
      );
      if (userProfile.documents.length) {
        return userProfile.documents[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Error fetching user profile:');
    }
  }

  async assignRoleToUser({
    userId,
    roleName,
  }: {
    userId: string;
    roleName: RoleType;
  }): Promise<void> {
    const database = this.appwriteClientService.getDatabaseService();
    const roleId = await this.appwriteRoleService.getRoleIdByName(roleName);
    try {
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile) {
        throw new Error(`User profile not found for user ${userId}`);
      }

      const existingRoleIds = userProfile.roleIds || [];
      const updatedRoleIds = [...existingRoleIds, roleId];

      // Update the user profile with the new set of role IDs
      await database.updateDocument(
        this.databaseId,
        this.userProfileCollectionId,
        userProfile.$id, // Use the document ID from Appwrite response
        { roleIds: updatedRoleIds },
      );
    } catch (error) {
      console.error('Error assigning role to user:', error);
    }
  }
}
