import { Controller, Get } from '@nestjs/common';
import { Child } from '../entities';
import { ChildService } from '../services/child.service';

@Controller('child')
export class ChildDetailsController {
  constructor(private readonly childService: ChildService) {}

  @Get()
  async getAll(): Promise<Child[]> {
    return this.childService.findAll();
  }
}
