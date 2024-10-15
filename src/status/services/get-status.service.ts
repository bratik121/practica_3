import { IService } from 'src/common/aplication/services/iservice';
import { getStatusRequest } from '../request';
import { getStatusResponse } from '../responses';

export class GetStatusService
  implements IService<getStatusRequest, getStatusResponse>
{
  async execute(request: getStatusRequest): Promise<getStatusResponse> {
    return new getStatusResponse();
  }
}
