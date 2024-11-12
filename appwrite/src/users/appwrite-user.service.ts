import { Injectable } from '@nestjs/common';
import { AppwriteClientService } from '../appwrite-client.service';
import { LoginDto } from '@app-modules/auth/dtos/login.dto';
import { UserType } from '@app-types/module.types';

@Injectable()
export class AppwriteUserService {
  constructor(private readonly appwriteClientService: AppwriteClientService) {}

  // Register a new user
  async registerUser(
    email: string,
    password: string,
    name: string,
    userType: UserType,
  ) {
    const account = this.appwriteClientService.getAccountService();
    const database = this.appwriteClientService.getDatabaseService();

    try {
      // Step 1: Create the user in Appwrite
      const user = await account.create('unique()', email, password, name);

      // Step 2: Authenticate the user to get a session token
      const session = await account.createSession(email, password);

      // Step 3: Generate a JWT for the authenticated user
      const jwtResponse = await account.createJWT();

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
        { userId: user.$id, userType }, // Document data
      );

      return { user, session: session, jwtToken: jwtResponse.jwt };
    } catch (error) {
      throw new Error(
        `Failed to register and generate JWT for user: ${error.message}`,
      );
    }
  }

  // Log in a user
  async loginUser(loginDto: LoginDto) {
    const account = this.appwriteClientService.getAccountService();
    try {
      // Step 1: Authenticate the user to create a session
      const session = await account.createSession(
        loginDto.email,
        loginDto.password,
      );

      // Step 2: Generate a JWT for the authenticated user
      const jwtResponse = await account.createJWT();

      return { session, jwtToken: jwtResponse.jwt };
    } catch (error) {
      throw new Error(
        `Failed to login and generate JWT for user: ${error.message}`,
      );
    }
  }

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
}
