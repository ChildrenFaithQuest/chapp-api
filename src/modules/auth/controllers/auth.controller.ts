import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { Auth } from '../entities/auth.entity';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';

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
}
