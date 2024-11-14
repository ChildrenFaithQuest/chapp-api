// src/types/express-request.interface.ts
import { Request } from 'express';
import { Models } from 'node-appwrite';

export interface CustomRequest extends Request {
  user?: Models.User<Models.Preferences>;
}
