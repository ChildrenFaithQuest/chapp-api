import { Test, TestingModule } from '@nestjs/testing';
import { OrgController } from './org.controller';
import { OrgService } from '../services/org.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Organization } from '../entities/organization.entity';
import { mockOrgArray } from '@app-root/mocks/organization';
import { UpdateOrgDto } from '../dtos/update-org.dto';
import { OrgType } from '@app-types/module.types';

const mockOrgRepository = () => ({
  findOne: jest.fn(),
  remove: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('Org Controller', () => {
  let orgController: OrgController;
  let orgService: OrgService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgController],
      providers: [
        OrgService,
        {
          provide: getRepositoryToken(Organization),
          useValue: mockOrgRepository(), // Mock repository
        },
      ],
    }).compile();
    orgService = module.get<OrgService>(OrgService);
    orgController = new OrgController(orgService);
  });
  it('should return an array of all organizations', async () => {
    orgService.findAll = jest.fn().mockImplementation(() => mockOrgArray);
    const result = await orgController.getAll();
    expect(result).toBe(mockOrgArray);
  });

  it('should return an organization', async () => {
    const id = '6a75d024-0aef-453e-8861-9f5e84dd72c6';
    orgService.findOne = jest.fn().mockImplementation(() => mockOrgArray[1]);
    const result = await orgController.findOne(id);
    expect(orgService.findOne).toHaveBeenCalledWith(id);
    expect(result).toBe(mockOrgArray[1]);
  });

  it('should update an organization', async () => {
    const id = 'testId';
    const updateOrgDto: Partial<UpdateOrgDto> = {
      type: OrgType.SCHOOL,
    };

    const updatedOrg = {
      ...mockOrgArray[0], // All fields from the existing parent
      ...updateOrgDto, // Only gender is updated
    };
    orgService.update = jest.fn().mockImplementation(() => updatedOrg);

    const result = await orgController.update(id, updateOrgDto);

    expect(orgService.update).toHaveBeenCalledWith(id, updateOrgDto);
    expect(result).toStrictEqual(updatedOrg);
  });

  it('should delete an organization', async () => {
    orgService.delete = jest.fn().mockImplementation(() => {});
    const id = 'testId';
    await orgController.delete(id);
    expect(orgService.delete).toHaveBeenCalledWith(id);
  });
});
