import { DirectoryEmailEntity } from 'src/directories/entities';
import { EntityManager, Repository } from 'typeorm';
import { IDirectoryEmailRepository } from './directory-email.repository.interface';
import { Result } from 'src/common/result/result';
import { HttpException, HttpStatus } from '@nestjs/common';

export class DirectoryEmailRepository
  extends Repository<DirectoryEmailEntity>
  implements IDirectoryEmailRepository
{
  constructor(entityManager: EntityManager) {
    super(DirectoryEmailEntity, entityManager);
  }

  // Método para eliminar un correo asociado a un directorio
  async deleteDirectoryEmail(
    directoryEmail: DirectoryEmailEntity,
  ): Promise<Result<void>> {
    try {
      // Verificar si el correo existe antes de intentar eliminarlo
      const emailToDelete = await this.findOne({
        where: { id: directoryEmail.id },  // Usamos where para buscar por id
      });
      if (!emailToDelete) {
        return Result.fail(
          new HttpException(
            `Directory email with ID ${directoryEmail.id} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      // Si existe, proceder a eliminar
      await this.remove(emailToDelete);
      return Result.success();
    } catch (error) {
      return Result.fail(
        new HttpException(
          `Error deleting directory email: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  // Método para guardar un nuevo correo asociado a un directorio
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

  // Método para encontrar un correo por su valor
  async findOneByEmail(email: string): Promise<Result<DirectoryEmailEntity>> {
    try {
      const directoryEmailEntity = await this.findOne({
        select: [`id`, `email`, `id_directory`],
        where: { email },
      });

      if (!directoryEmailEntity) {
        return Result.fail<DirectoryEmailEntity>(
          new HttpException(
            `Directory email with email: ${email} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      return Result.success<DirectoryEmailEntity>(directoryEmailEntity);
    } catch (error) {
      return Result.fail<DirectoryEmailEntity>(
        new HttpException(
          `Error finding directory email with email: ${email}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  // Método para encontrar todos los correos de un directorio por el ID del directorio
  async findEmailsByDirectoryId(
    id: number,
  ): Promise<Result<DirectoryEmailEntity[]>> {
    try {
      const directoryEmailEntities = await this.find({
        select: [`id`, `email`, `id_directory`],
        where: { id_directory: id },
      });

      // Validar si no se encontraron correos
      if (!directoryEmailEntities || directoryEmailEntities.length === 0) {
        return Result.fail<DirectoryEmailEntity[]>(
          new HttpException(
            `No emails found for directory ID: ${id}`,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      return Result.success<DirectoryEmailEntity[]>(directoryEmailEntities);
    } catch (error) {
      return Result.fail<DirectoryEmailEntity[]>(
        new HttpException(
          `Error finding emails for directory ID: ${id}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }
}
