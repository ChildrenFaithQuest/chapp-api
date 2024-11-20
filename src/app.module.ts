import * as path from 'path';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModule } from '@app-modules/user';
import { AuthModule } from '@app-modules/auth/auth.module';
import { OrgModule } from '@app-modules/organization/organization.module';
import { RoleModule } from '@app-modules/role/role.module';
import { UsersController } from '@app-modules/user/controllers/user.controller';
import { ChildDetailsController } from '@app-modules/user/controllers/child.controller';
import { AppwriteModule } from '@app-root/appwrite/appwrite.module';
import { ClassModule } from '@app-modules/class/class.module';
import { AttendanceModule } from '@app-modules/attendance/attendance.module';

import { AppController } from './app.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { createAppDataSource } from './typeorm.config';
import { AppService } from './app.service';
import { envValidationSchema } from './config/env.validation';

const env = process.env.NODE_ENV || 'development'; // Default to 'development' if NODE_ENV is undefined

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available across the app
      envFilePath: path.resolve(process.cwd(), `.env.${env}.local`), // Path to the .env file
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: true, // Stop validation on the first error
        allowUnknown: true, // Ignore unknown environment variables
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to inject ConfigService
      inject: [ConfigService], // Inject ConfigService into the factory
      useFactory: async (configService: ConfigService) => {
        const dataSourceOptions = createAppDataSource(configService);
        return {
          ...dataSourceOptions.options,
        };
      },
    }),
    AppwriteModule,
    UserModule,
    AuthModule,
    ClassModule,
    AttendanceModule,
    OrgModule,
    RoleModule,
  ],

  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(UsersController, ChildDetailsController); // Apply middleware to all routes
  }
}
