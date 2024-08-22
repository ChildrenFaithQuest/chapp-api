import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Request,
  Patch,
} from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { Auth } from '../entities/auth.entity';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDetails: LoginDto): Promise<Auth> {
    return this.authService.login(loginDetails);
  }

  @Post('signup')
  async register(@Body() signupDetails: RegisterDto): Promise<Auth> {
    return this.authService.register(signupDetails);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<string> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Patch('change-password')
  async changePassword(
    @Request() req: { auth: { id: string } },
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<string> {
    const authId = req.auth.id;
    try {
      return this.authService.changePassword(authId, changePasswordDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
