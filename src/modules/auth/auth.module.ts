import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from '@app-shared/services/password-service';
import { Auth } from './entities/auth.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '@app-modules/user';
import { JwtModule } from '@nestjs/jwt';
import { AppwriteModule } from '@app-root/appwrite/appwrite.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    forwardRef(() => UserModule),
    forwardRef(() => AppwriteModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key', // Use environment variables for security
      signOptions: { expiresIn: '1h' }, // Set the token expiration time
    }),
  ],
  providers: [AuthService, PasswordService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
