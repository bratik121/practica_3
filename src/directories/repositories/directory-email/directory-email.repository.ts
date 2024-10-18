import { DirectoryEmailEntity } from 'src/directories/entities';
import { Repository } from 'typeorm';
import { IDirectoryEmailRepository } from './directory-email.repository.interface';
import { Result } from 'src/common/result/result';
import { HttpException, HttpStatus } from '@nestjs/common';
export class DirectoryEmailRepository
  extends Repository<DirectoryEmailEntity>
  implements IDirectoryEmailRepository
{
  deleteDirectoryEmail(
    directoryEmail: DirectoryEmailEntity,
  ): Promise<Result<void>> {
    throw new Error('Method not implemented.');
  }
  async saveEmail(
    id_directory: number,
    email: string,
  ): Promise<Result<DirectoryEmailEntity>> {
    try {
      const directoryEmail = DirectoryEmailEntity.create(email, id_directory);
      const savedDirectoryEmail = await this.save(directoryEmail);
      return Result.success(savedDirectoryEmail);
    } catch (error) {
      return Result.fail<DirectoryEmailEntity>(
        new HttpException(
          `Fail saving the directory email: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }
  async findOneByEmail(email: string): Promise<Result<DirectoryEmailEntity>> {
    try {
      const directoryEmailEntity = await this.findOne({
        select: [`id`, `email`, `id_directory`],
        where: {
          email: email,
        },
      });
      return Result.success<DirectoryEmailEntity>(directoryEmailEntity);
    } catch (error) {
      return Result.fail<DirectoryEmailEntity>(
        new HttpException(
          `directory email with email: ${email} not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
    }
  }
  async findEmailsByDirectoryId(
    id: number,
  ): Promise<Result<DirectoryEmailEntity[]>> {
    try {
      const directoryEmailEntities = await this.find({
        select: [`id`, `email`, `id_directory`],
        where: {
          id_directory: id,
        },
      });
      return Result.success<DirectoryEmailEntity[]>(directoryEmailEntities);
    } catch (error) {
      return Result.fail<DirectoryEmailEntity[]>(
        new HttpException(
          `directory email with id_directory: ${id} not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
    }
  }
}
