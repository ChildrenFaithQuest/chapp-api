import { Injectable } from '@nestjs/common';
import { AppwriteClientService } from '../appwrite-client.service';
import { LoginDto } from '@app-modules/auth/dtos/login.dto';
import { RegisterDto } from '@app-modules/auth/dtos/register.dto';
import { Models } from 'node-appwrite';
import { AppwriteUserService } from './appwrite-user.service';

@Injectable()
export class AppwriteAuthService {
  constructor(
    private readonly appwriteClientService: AppwriteClientService,
    private readonly appwriteUserService: AppwriteUserService,
  ) {}

  // Register a new user
  async registerUser(registerDto: RegisterDto): Promise<{
    appwriteUser: Models.User<Models.Preferences>;
    session: Models.Session;
    jwtToken: string;
  }> {
    const { email, password, userType, name } = registerDto;
    const account = this.appwriteClientService.getAccountService();

    try {
      // Step 1: Create the user in Appwrite
      const appwriteUser = await account.create(
        'unique()',
        email,
        password,
        name,
      );

      // Step 2: Authenticate the user to get a session token
      const session = await account.createSession(email, password);

      // Step 3: Generate a JWT for the authenticated user
      const jwtResponse = await account.createJWT();

      // Step 4: Store the user type in the UserProfiles collection
      await this.appwriteUserService.setUserProfile(userType, appwriteUser.$id);

      return { appwriteUser, session: session, jwtToken: jwtResponse.jwt };
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

  async validateToken(token: string): Promise<Models.User<Models.Preferences>> {
    const account = this.appwriteClientService.getAccountService();

    try {
      // Use the Appwrite SDK to get the current user based on the token
      this.appwriteClientService.setJWT(token);
      const user = await account.get();
      return user;
    } catch (error) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  }
}
