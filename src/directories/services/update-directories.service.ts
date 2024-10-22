import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IService } from 'src/common/aplication/services/iservice';
import { UpdateDirectoryRequest } from '../request/update-directories-requests';
import { UpdateDirectoryResponse } from '../responses/update-directories-responses';
import { Result } from 'src/common/result/result';
import { IDirectoryRepository } from '../repositories/directory/directory.repository.interface';
import { IDirectoryEmailRepository } from '../repositories/directory-email/directory-email.repository.interface';
import { DirectoryEmailEntity, DirectoryEntity } from '../entities';
import { DeleteDirectoryService } from './delete-directory.service';

@Injectable()
export class UpdateDirectoryService
  implements IService<UpdateDirectoryRequest, UpdateDirectoryResponse>
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
    request: UpdateDirectoryRequest,
  ): Promise<Result<UpdateDirectoryResponse>> {
    const directoryResult = await this._directoryRepository.findDirectoryById(
      request.id,
    );
    if (directoryResult.isFailure()) {
      return Result.fail(directoryResult.getError());
    }

    const directory = directoryResult.getValue();

    if (request.name) {
      directory.name = request.name;
    }

    if (request.directoryEmails) {
      const existingEmailsResult =
        await this._directoryEmailRepository.findEmailsByDirectoryId(
          directory.id,
        );

      if (existingEmailsResult.isFailure()) {
        return Result.fail<UpdateDirectoryResponse>(
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

    delete directory.directoryEmails;
    const updatedDirectoryResult =
      await this._directoryRepository.saveDirectory(directory);

    if (updatedDirectoryResult.isFailure()) {
      return Result.fail(updatedDirectoryResult.getError());
    }

    return Result.success(
      new UpdateDirectoryResponse(
        directory.id,
        directory.name,
        request.directoryEmails || [],
      ),
    );
  }
}
