import { DataSource } from 'typeorm';
import { User } from './modules/user/entities/user.entity';
import { Parent } from './modules/user/entities/parent.entity';
import { Teacher } from './modules/user/entities/teacher.entity';
import { Child } from './modules/user/entities/child.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Parent, Teacher, Child], // Ensure this path is correct
  migrations: ['dist/migrations/*.js'], // Ensure this path is correct
  synchronize: false,
});
