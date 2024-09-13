import { Repository } from 'typeorm';
import { Child } from '../entities/child.entity';
import { ChildService } from '../services/child.service';
import { UserService } from '../services/user.service';
import { ChildDetailsController } from './child.controller';
import { mockChildren } from '@app-root/mocks/child';
import { mockClass } from '@app-root/mocks/class';
import { UserGender } from '@app-types/module.types';

describe('ChildController', () => {
  let childController: ChildDetailsController;
  let childService: ChildService;
  let userService: UserService;
  let childRepository: Repository<Child>;

  beforeEach(() => {
    childService = new ChildService(childRepository, userService);
    childController = new ChildDetailsController(childService);
    jest.spyOn(childService, 'findAll').mockResolvedValue(mockChildren);
  });

  describe('getAll', () => {
    it('should return an array of children', async () => {
      // jest.spyOn(childService, 'findAll').mockResolvedValue(mockChildren);
      expect(await childController.getAll()).toBe(mockChildren);
    });
  });

  describe('find', () => {
    it('should return a child', async () => {
      jest.spyOn(childService, 'findOne').mockResolvedValue(mockChildren[2]);
      expect(await childController.findOne('child_003')).toBe(mockChildren[2]);
    });
  });

  describe('update', () => {
    it('should return a child', async () => {
      const updatedChild = {
        id: 'child_001',
        gender: UserGender.FEMALE,
        firstName: 'Sophia',
        lastName: 'Johnson',
        class: mockClass.FAITHFULNESS,
        createdAt: new Date('2021-10-12T22:45:00Z'),
        updatedAt: new Date('2021-10-12T22:45:00Z'),
      };
      jest.spyOn(childService, 'update').mockResolvedValue(mockChildren[0]);
      expect(
        await childController.update('child_001', {
          gender: UserGender.FEMALE,
        }),
      ).toStrictEqual(updatedChild);
    });
  });

  describe('partialUpdate', () => {
    it('should return a child', async () => {
      const updatedChild = {
        id: 'child_001',
        gender: UserGender.FEMALE,
        firstName: 'Sophia',
        lastName: 'Johnson',
        class: mockClass.FAITHFULNESS,
        createdAt: new Date('2021-10-12T22:45:00Z'),
        updatedAt: new Date('2021-10-12T22:45:00Z'),
      };
      jest
        .spyOn(childService, 'partialUpdate')
        .mockResolvedValue(mockChildren[0]);
      expect(
        await childController.partialUpdate('child_001', {
          gender: UserGender.FEMALE,
        }),
      ).toStrictEqual(updatedChild);
    });
  });
});
