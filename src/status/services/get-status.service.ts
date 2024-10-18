import { IService } from 'src/common/aplication/services/iservice';
import { GetStatusRequest } from '../request';
import { GetStatusResponse } from '../responses';
import { Result } from 'src/common/result/result';

export class GetStatusService
  implements IService<GetStatusRequest, GetStatusResponse>
{
  async execute(request: GetStatusRequest): Promise<Result<GetStatusResponse>> {
    return Result.success(new GetStatusResponse());
  }
}
