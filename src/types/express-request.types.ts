// src/types/express-request.interface.ts
import { Auth } from '@app-modules/auth/entities/auth.entity';
import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: Auth;
}
