import { Result } from 'src/common/result/result';
import { DirectoryEntity } from 'src/directories/entities';
import { IDirectoryRepository } from './directory.repository.interface';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityManager } from 'typeorm';

export class DirectoryRepository
  extends Repository<DirectoryEntity>
  implements IDirectoryRepository
{
  constructor(entity: EntityManager) {
    super(DirectoryEntity, entity);
  }

  async saveDirectory(
    directory: DirectoryEntity,
  ): Promise<Result<DirectoryEntity>> {
    try {
      const savedDirectory = await this.save(directory);
      return Result.success(savedDirectory);
    } catch (error) {
      return Result.fail(
        new HttpException(
          `Error saving directory: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async findDirectoryById(id: number): Promise<Result<DirectoryEntity>> {
    try {
      const directory = await this.findOne({
        select: ['id', 'name'],
        where: { id },
        relations: ['directoryEmails'],
      });
      if (!directory) {
        return Result.fail<DirectoryEntity>(
          new HttpException(
            `Directory with id ${id} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );
      }
      return Result.success(directory);
    } catch (error) {
      return Result.fail<DirectoryEntity>(
        new HttpException(
          `Directory with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
    }
  }

  async findOneDirectoryByName(name: string): Promise<Result<DirectoryEntity>> {
    try {
      const directory = await this.findOne({
        select: ['id', 'name'],
        where: { name },
        relations: ['directoryEmails'],
      });

      if (!directory) {
        return Result.fail<DirectoryEntity>(
          new HttpException(
            `Directory with name ${name} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      return Result.success(directory);
    } catch (error) {
      return Result.fail<DirectoryEntity>(
        new HttpException(
          `Directory with name ${name} not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
    }
  }

  updateDirectory(
    directory: DirectoryEntity,
  ): Promise<Result<DirectoryEntity>> {
    throw new Error('Method not implemented.');
  }

  async deleteDirectory(directory: DirectoryEntity): Promise<Result<void>> {
    try {
      await this.remove(directory);
      return Result.success();
    } catch (error) {
      return Result.fail(
        new HttpException(
          `Error deleting directory: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async findAllDirectories(
    limit?: number,
    offset?: number,
  ): Promise<Result<DirectoryEntity[]>> {
    try {
      const directories = await this.find({
        select: ['id', 'name'],
        skip: offset,
        take: limit,
        relations: ['directoryEmails'],
      });
      return Result.success(directories);
    } catch (error) {
      return Result.fail(
        new HttpException(
          `Error fetching directories`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }
}
