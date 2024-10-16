import { IsString, IsEnum } from 'class-validator';

import { OrgType } from '@app-types/module.types';

export class CreateOrgDto {
  @IsString()
  name: string;

  @IsEnum(OrgType, {
    message: 'orgType must be a valid enum value (school, church)',
  })
  type: OrgType;

  @IsString()
  description?: string;

  @IsString()
  address: string;
}
