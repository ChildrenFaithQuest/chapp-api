import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppwriteRoleService } from './src/services/roles/appwrite-role.service';
import { AppwriteUserService } from './src/services/users/appwrite-user.service';
import { AppwriteClientService } from './src/services/appwrite-client.service';
import { AppwriteAuthService } from './src/services/users/appwrite-auth.service';
import { RoleModule } from '@app-modules/role/role.module';
import { AuthModule } from '@app-modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => RoleModule),
    forwardRef(() => AuthModule),
  ],
  providers: [
    AppwriteUserService,
    AppwriteAuthService,
    ConfigService,
    AppwriteClientService,
    AppwriteRoleService,
  ],
  controllers: [],
  exports: [
    AppwriteUserService,
    AppwriteAuthService,
    ConfigService,
    AppwriteClientService,
    AppwriteRoleService,
  ],
})
export class AppwriteModule {}
