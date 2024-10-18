import { IService } from 'src/common/aplication/services/iservice';
import { CreateDirectoryRequest } from '../request';
import { CreateDirectoryResponse } from '../responses';
import { Result } from 'src/common/result/result';
import { IDirectoryRepository } from '../repositories/directory/directory.repository.interface';
import { IDirectoryEmailRepository } from '../repositories/directory-email/directory-email.repository.interface';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DirectoryEntity } from '../entities';

export class CreateDirectoryService
  implements IService<CreateDirectoryRequest, CreateDirectoryResponse>
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
    request: CreateDirectoryRequest,
  ): Promise<Result<CreateDirectoryResponse>> {
    const duplicateNameResult =
      await this._directoryRepository.findOneDirectoryByName(request.name);

    if (duplicateNameResult.isSuccess()) {
      return Result.fail(
        new HttpException(
          `Directory with name ${request.name} already exists`,
          HttpStatus.CONFLICT,
        ),
      );
    }

    const emails = request.directoryEmails;

    for (const email of emails) {
      const directoryResult =
        await this._directoryEmailRepository.findOneByEmail(email);

      if (directoryResult.isSuccess()) {
        return Result.fail(
          new HttpException(
            `Email ${email} already exists`,
            HttpStatus.CONFLICT,
          ),
        );
      }
    }

    const directory = DirectoryEntity.create(request.name);
    const savedDirectoryResult = await this._directoryRepository.saveDirectory(
      directory,
    );

    if (savedDirectoryResult.isFailure()) {
      return Result.fail(savedDirectoryResult.getError());
    }

    for (const email of emails) {
      const savedEmailResult = await this._directoryEmailRepository.saveEmail(
        savedDirectoryResult.getValue().id,
        email,
      );

      if (savedEmailResult.isFailure()) {
        return Result.fail(savedEmailResult.getError());
      }
    }

    return Result.success(
      new CreateDirectoryResponse(directory.id, directory.name, emails),
    );
  }
}
