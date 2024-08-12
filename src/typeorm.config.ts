import 'tsconfig-paths/register';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Child, Parent, Teacher, User } from '@user/entities';
import { Class } from '@class/entities/class.entity';
import { Attendance } from '@attendance/entities/attendance.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Parent, Teacher, Child, Class, Attendance], // Ensure this path is correct
  migrations: ['dist/migrations/*.js'], // Ensure this path is correct
  synchronize: false,
});
