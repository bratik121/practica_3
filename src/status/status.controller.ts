import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IService } from 'src/common/aplication/services/iservice';
import { getStatusRequest } from './request';
import { getStatusResponse } from './responses';
import { GetStatusService } from './services/get-status.service';

@Controller('status')
@ApiTags('Status')
export class StatusController {
  private getStatusService: IService<getStatusRequest, getStatusResponse>;

  constructor() {
    this.getStatusService = new GetStatusService();
  }

  @Get('')
  async getStatus() {
    return this.getStatusService.execute(new getStatusRequest());
  }
}
