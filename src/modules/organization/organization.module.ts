import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrgController } from './controllers/org.controller';
import { OrgService } from './services/org.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  providers: [OrgService],
  controllers: [OrgController],
  exports: [],
})
export class OrgModule {}
