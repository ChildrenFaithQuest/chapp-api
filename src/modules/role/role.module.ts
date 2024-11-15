import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleService } from './services/role.service';
import { AppwriteModule } from '@app-root/appwrite/appwrite.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), forwardRef(() => AppwriteModule)],
  providers: [RoleService],
  controllers: [],
  exports: [RoleService],
})
export class RoleModule {}
