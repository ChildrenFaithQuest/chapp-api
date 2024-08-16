import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { UpdateUserDto } from '../dto/update-user.dto';

interface HasId {
  id: string;
}

@Injectable()
export class UserService {
  constructor() {}
  /**
   * Updates a user by merging the provided data with the existing entity.
   * @param id The ID of the user to update.
   * @param updateUserDto The data to update.
   * @param repository The repository of the entity type (Parent, Teacher, Child).
   * @returns The updated user entity.
   */
  async update<T extends ObjectLiteral & HasId>(
    id: string,
    updateUserDto: UpdateUserDto,
    repository: Repository<T>,
  ): Promise<T> {
    const whereCondition: FindOptionsWhere<T> = { id } as FindOptionsWhere<T>;
    const user = await repository.findOne({
      where: whereCondition,
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    // Update user details
    Object.assign(user, updateUserDto);

    // Save the updated user
    return await repository.save(user);
  }

  /**
   * Partially updates a user by merging the provided data with the existing entity.
   * @param id The ID of the user to update.
   * @param partialData The data to update.
   * @param repository The repository of the entity type (Parent, Teacher, Child).
   * @returns The updated user entity.
   */
  async partialUpdate<T extends ObjectLiteral>(
    id: string,
    partialData: DeepPartial<T>,
    repository: Repository<T>,
  ): Promise<T> {
    // Attempt to preload the entity
    const updatedUser = await repository.preload({
      id,
      ...partialData,
    });

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Save the updated user back to the database
    return await repository.save(updatedUser);
  }
}
