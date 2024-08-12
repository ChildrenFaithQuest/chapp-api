import 'tsconfig-paths/register';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Child, Parent, Teacher, User } from '@user/entities';
import { Class } from '@class/entities/class.entity';
import { Attendance } from '@attendance/entities/attendance.entity';
import { Church } from 'modules/church/entities/church.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Parent, Teacher, Child, Class, Attendance, Church], // Ensure this path is correct
  migrations: ['src/migrations/*.ts'], // Ensure this path is correct
  synchronize: false,
});
