import { Controller, Get } from '@nestjs/common';
import { ParentService } from '../services/parent.service';
import { Parent } from '../entities';

@Controller('parent')
export class ParentDetailsController {
  constructor(private readonly parentService: ParentService) {}

  @Get()
  async getAll(): Promise<Parent[]> {
    return this.parentService.findAll();
  }
}
