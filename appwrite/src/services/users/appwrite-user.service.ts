import { Injectable } from '@nestjs/common';
import { AppwriteClientService } from '../appwrite-client.service';
import { UserType } from '@app-types/module.types';
import { Models } from 'node-appwrite';

@Injectable()
export class AppwriteUserService {
  constructor(private readonly appwriteClientService: AppwriteClientService) {}

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

  async setUserType(
    userType: UserType,
    appwriteUser: Models.User<Models.Preferences>,
  ): Promise<void> {
    // Code to set the user type
    const database = this.appwriteClientService.getDatabaseService();

    if (
      !process.env.APPWRITE_DATABASE_ID ||
      !process.env.APPWRITE_USER_COLLECTION_ID
    ) {
      throw new Error(
        'APPWRITE_DATABASE_ID or  APPWRITE_USER_COLLECTION_ID environment variable is not defined',
      );
    }

    // Step 2: Store the user type in the UserProfiles collection
    await database.createDocument(
      process.env.APPWRITE_DATABASE_ID, // Database ID in Appwrite
      process.env.APPWRITE_USER_COLLECTION_ID, // Collection ID
      'unique()', // Unique document ID
      { userId: appwriteUser.$id, userType }, // Document data
    );
  }

  async getUserType(userId: string): Promise<UserType | null> {
    const database = this.appwriteClientService.getDatabaseService();

    if (
      !process.env.APPWRITE_DATABASE_ID ||
      !process.env.APPWRITE_USER_COLLECTION_ID
    ) {
      throw new Error(
        'APPWRITE_DATABASE_ID or APPWRITE_USER_COLLECTION_ID environment variable is not defined',
      );
    }

    const userProfile = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID, // Database ID in Appwrite
      process.env.APPWRITE_USER_COLLECTION_ID, // Collection ID
      [`userId=${userId}`], // Filter to match the userId
    );

    return userProfile.documents.length
      ? userProfile.documents[0].userType
      : null;
  }

  // Function to assign a role to a user
  async assignRoleToUser({
    userId,
    roleId,
  }: {
    userId: string;
    roleId: string;
  }): Promise<void> {
    const database = this.appwriteClientService.getDatabaseService();
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
}
