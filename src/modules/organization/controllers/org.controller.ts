import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { Organization } from '../entities/organization.entity';
import { OrgService } from '../services/org.service';
import { UpdateOrgDto } from '../dtos/update-org.dto';

@Controller('org')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  @Get()
  async getAll(): Promise<Organization[]> {
    return this.orgService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Organization | null> {
    return this.orgService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrgDto: UpdateOrgDto) {
    return this.orgService.update(id, updateOrgDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.orgService.delete(id);
  }
}
