import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IService } from 'src/common/application/services/iservice';
import { UpdateDirectoryRequest } from '../request/update-directories-requests';
import { UpdateDirectoryResponse } from '../responses/update-directories-responses';
import { Result } from 'src/common/result/result';
import { IDirectoryRepository } from '../repositories/directory/directory.repository.interface';
import { IDirectoryEmailRepository } from '../repositories/directory-email/directory-email.repository.interface';
import { DirectoryEntity } from '../entities';
import { DeleteDirectoryService } from '../services/delete-directory.service';

@Injectable()
export class UpdateDirectoryService implements IService<UpdateDirectoryRequest, UpdateDirectoryResponse> {
  private readonly _directoryRepository: IDirectoryRepository;
  private readonly _directoryEmailRepository: IDirectoryEmailRepository;

  constructor(
    directoryRepository: IDirectoryRepository,
    directoryEmailRepository: IDirectoryEmailRepository,
  ) {
    this._directoryRepository = directoryRepository;
    this._directoryEmailRepository = directoryEmailRepository;
  }

  async execute(request: UpdateDirectoryRequest): Promise<Result<UpdateDirectoryResponse>> {
    const directoryResult = await this._directoryRepository.findDirectoryById(request.id);
    if (directoryResult.isFailure()) {
      return Result.fail(
        new HttpException(
          `Directory with ID ${(request.id)} not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
    }

    const directory = directoryResult.getValue();

    if (request.name) {
      directory.name = request.name;
    }

    if (request.directoryEmails) {
      const existingEmails = await this._directoryEmailRepository.findByDirectoryId(directory.id);
      const emailsToRemove = existingEmails.filter(email => !request.directoryEmails.includes(email));
      const emailsToAdd = request.directoryEmails.filter(email => !existingEmails.includes(email));

      for (const email of emailsToRemove) {
        await this._directoryEmailRepository.deleteEmail(directory.id, email);
      }

      for (const email of emailsToAdd) {
        const emailResult = await this._directoryEmailRepository.saveEmail(directory.id, email);
        if (emailResult.isFailure()) {
          return Result.fail(emailResult.getError());
        }
      }
    }

    const updatedDirectoryResult = await this._directoryRepository.saveDirectory(directory);

    if (updatedDirectoryResult.isFailure()) {
      return Result.fail(updatedDirectoryResult.getError());
    }

    return Result.success(
      new UpdateDirectoryResponse(directory.id, directory.name, request.directoryEmails || []),
    );
  }
}
