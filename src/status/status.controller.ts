import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IService } from 'src/common/aplication/services/iservice';
import { GetStatusRequest } from './request';
import { GetStatusResponse } from './responses';
import { GetStatusService } from './services/get-status.service';

@Controller('status')
@ApiTags('Status')
export class StatusController {
  private getStatusService: IService<GetStatusRequest, GetStatusResponse>;

  constructor() {
    this.getStatusService = new GetStatusService();
  }

  @Get('')
  async getStatus() {
    const response = await this.getStatusService.execute(
      new GetStatusRequest(),
    );
    return response.getValue();
  }
}
