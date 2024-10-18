import { IService } from 'src/common/aplication/services/iservice';
import { CreateDirectoryRequest } from '../request';
import { CreateDirectoryResponse } from '../responses';
import { Result } from 'src/common/result/result';
import { IDirectoryRepository } from '../repositories/directory/directory.repository.interface';

export class CreateDirectoryService
  implements IService<CreateDirectoryRequest, CreateDirectoryResponse>
{
  private readonly _directoryRepository: IDirectoryRepository;

  execute(
    request: CreateDirectoryRequest,
  ): Promise<Result<CreateDirectoryResponse>> {
    throw new Error('Method not implemented.');
  }
}
