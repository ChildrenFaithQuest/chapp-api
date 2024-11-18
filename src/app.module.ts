import * as path from 'path';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppDataSource } from './typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { ClassModule } from './modules/class/class.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { UserModule } from '@app-modules/user';
import { AuthModule } from '@app-modules/auth/auth.module';
import { OrgModule } from '@app-modules/organization/organization.module';
import { RoleModule } from '@app-modules/role/role.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { UsersController } from '@app-modules/user/controllers/user.controller';
import { ChildDetailsController } from '@app-modules/user/controllers/child.controller';
import { envValidationSchema } from './config/env.validation';
import { AppwriteModule } from '@app-root/appwrite/appwrite.module';

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
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      autoLoadEntities: true,
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
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(UsersController, ChildDetailsController); // Apply middleware to all routes
  }
}
