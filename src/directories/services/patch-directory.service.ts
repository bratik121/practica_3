import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IService } from 'src/common/aplication/services/iservice';
import { PatchDirectoryRequest } from '../request/';
import { PatchDirectoryResponse } from '../responses/';
import { Result } from 'src/common/result/result';
import { IDirectoryRepository } from '../repositories/directory/directory.repository.interface';
import { IDirectoryEmailRepository } from '../repositories/directory-email/directory-email.repository.interface';
import { DirectoryEmailEntity } from '../entities';

@Injectable()
export class PatchDirectoryService
  implements IService<PatchDirectoryRequest, PatchDirectoryResponse>
{
  private readonly _directoryRepository: IDirectoryRepository;
  private readonly _directoryEmailRepository: IDirectoryEmailRepository;

  constructor(
    directoryRepository: IDirectoryRepository,
    directoryEmailRepository: IDirectoryEmailRepository,
  ) {
    this._directoryRepository = directoryRepository;
    this._directoryEmailRepository = directoryEmailRepository;
  }

  async execute(
    request: PatchDirectoryRequest,
  ): Promise<Result<PatchDirectoryResponse>> {
    const directoryResult = await this._directoryRepository.findDirectoryById(
      request.id,
    );
    if (directoryResult.isFailure()) {
      return Result.fail(directoryResult.getError());
    }

    const directory = directoryResult.getValue();

    // Si el nombre está en la solicitud, actualizamos el nombre
    if (request.name) {
      directory.name = request.name;
    }

    // Si los correos electrónicos están en la solicitud, manejamos los cambios
    if (request.directoryEmails) {
      const existingEmailsResult =
        await this._directoryEmailRepository.findEmailsByDirectoryId(
          directory.id,
        );

      if (existingEmailsResult.isFailure()) {
        return Result.fail<PatchDirectoryResponse>(
          existingEmailsResult.getError(),
        );
      }

      const existingEmails = existingEmailsResult.getValue();
      const emailsOfDirectory = existingEmails.map(
        (directoryEmail) => directoryEmail.email,
      );

      const emailsToRemove = emailsOfDirectory.filter(
        (email) => !request.directoryEmails.includes(email),
      );

      const emailsToAdd = request.directoryEmails.filter(
        (email) => !emailsOfDirectory.includes(email),
      );

      for (const email of emailsToRemove) {
        const directoryEmail = DirectoryEmailEntity.create(email, directory.id);
        await this._directoryEmailRepository.deleteDirectoryEmail(
          directoryEmail,
        );
      }

      for (const email of emailsToAdd) {
        const emailResult = await this._directoryEmailRepository.saveEmail(
          directory.id,
          email,
        );
        if (emailResult.isFailure()) {
          return Result.fail(emailResult.getError());
        }
      }
    }

    // Removemos la relación de emails antes de hacer el save del directorio
    const oldDirectoriEmails = directory.directoryEmails;
    delete directory.directoryEmails;

    // Guardamos el directorio actualizado
    const updatedDirectoryResult =
      await this._directoryRepository.saveDirectory(directory);

    if (updatedDirectoryResult.isFailure()) {
      return Result.fail(updatedDirectoryResult.getError());
    }

    return Result.success(
      new PatchDirectoryResponse(
        directory.id,
        directory.name,
        request.directoryEmails
          ? request.directoryEmails
          : oldDirectoriEmails.map((a) => a.email),
      ),
    );
  }
}
