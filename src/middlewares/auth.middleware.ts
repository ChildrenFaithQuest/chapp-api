import { AuthService } from '@app-modules/auth/services/auth.service';
import { CustomRequest } from '@app-types/express-request.types';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (token) {
      try {
        // Decode the token and fetch user details
        const user = await this.authService.validateToken(token);
        req.user = user; // Attach user to the request
      } catch (error) {
        console.error('Failed to authenticate user:', error);
      }
    }

    next();
  }
}
