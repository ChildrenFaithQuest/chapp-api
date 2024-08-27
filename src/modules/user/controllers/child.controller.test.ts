import { Repository } from 'typeorm';
import { Child } from '../entities/child.entity';
import { ChildService } from '../services/child.service';
import { UserService } from '../services/user.service';
import { ChildDetailsController } from './child.controller';

describe('ChildController', () => {
  let childController: ChildDetailsController;
  let childService: ChildService;
  let userService: UserService;
  let childRepository: Repository<Child>;

  beforeEach(() => {
    childService = new ChildService(childRepository, userService);
    childController = new ChildDetailsController(childService);
  });

  describe('getAll', () => {
    it('should return an array of children', async () => {
      const mockChildren = [{ id: '' }] as Child[];
      jest.spyOn(childService, 'findAll').mockResolvedValue(mockChildren);

      expect(await childController.getAll()).toBe(mockChildren);
    });
  });
});
