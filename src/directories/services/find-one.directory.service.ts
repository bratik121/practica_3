import { IService } from 'src/common/aplication/services/iservice';
import { FindOneDirectoryRequest } from '../request';
import { FindOneDirectoryResponse } from '../responses';
import { Result } from 'src/common/result/result';
import { IDirectoryRepository } from '../repositories/directory/directory.repository.interface';
import { IDirectoryEmailRepository } from '../repositories/directory-email/directory-email.repository.interface';

export class FindOneDirectoryService
  implements IService<FindOneDirectoryRequest, FindOneDirectoryResponse>
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
    request: FindOneDirectoryRequest,
  ): Promise<Result<FindOneDirectoryResponse>> {
    const directoryResult = await this._directoryRepository.findDirectoryById(
      request.directoryId,
    );
    if (directoryResult.isFailure()) {
      return Result.fail(directoryResult.getError());
    }

    const directory = directoryResult.getValue();

    return Result.success(
      new FindOneDirectoryResponse(
        directory.id,
        directory.name,
        directory.directoryEmails.map((email) => email.email),
      ),
    );
  }
}
