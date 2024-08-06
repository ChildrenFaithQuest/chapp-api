import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Class } from '../class/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Class])],
  providers: [],
  controllers: [],
})
export class UserModule {}
