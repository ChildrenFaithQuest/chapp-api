import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from '@app-shared/services/password-service';
import { Auth } from './entities/auth.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '@app-modules/user';

@Module({
  imports: [TypeOrmModule.forFeature([Auth]), forwardRef(() => UserModule)],
  providers: [AuthService, PasswordService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
