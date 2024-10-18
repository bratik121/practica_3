import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IDirectoryRepository } from './repositories/directory/directory.repository.interface';
import { IDirectoryEmailRepository } from './repositories/directory-email/directory-email.repository.interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IService } from 'src/common/aplication/services/iservice';
import { CreateDirectoryRequest, FindOneDirectoryRequest } from './request';
import { CreateDirectoryResponse, FindOneDirectoryResponse } from './responses';
import { DirectoryRepository } from './repositories/directory/directory.repository';
import { DirectoryEmailRepository } from './repositories/directory-email/directory-email.repository';
import { CreateDirectoryService } from './services/create-directory.service';
import { CreateDirectoryDto } from './dto';
import { FindOneDirectoryService } from './services/find-one.directory.service';

@Controller('directories')
@ApiTags('Directories')
export class DirectoiresController {
  //?Repositories
  private readonly _directoryRepository: IDirectoryRepository;
  private readonly _directoryEmailRepository: IDirectoryEmailRepository;

  //?Services
  private createDirectoryService: IService<
    CreateDirectoryRequest,
    CreateDirectoryResponse
  >;

  private findOneDirectoryService: IService<
    FindOneDirectoryRequest,
    FindOneDirectoryResponse
  >;

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    //*Repositories
    this._directoryRepository = new DirectoryRepository(this.entityManager);
    this._directoryEmailRepository = new DirectoryEmailRepository(
      this.entityManager,
    );

    //*Services
    this.createDirectoryService = new CreateDirectoryService(
      this._directoryRepository,
      this._directoryEmailRepository,
    );

    this.findOneDirectoryService = new FindOneDirectoryService(
      this._directoryRepository,
      this._directoryEmailRepository,
    );
  }

  @Post()
  @ApiCreatedResponse({ description: 'Directory created succesfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async createDirectory(@Body() body: CreateDirectoryDto) {
    const request = new CreateDirectoryRequest(body.name, body.emails);
    const response = await this.createDirectoryService.execute(request);
    if (response.isSuccess()) {
      return response.getValue();
    }
    throw response.getError();
  }

  @Get(':id')
  @ApiFoundResponse({ description: 'Directory found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async getDirectoryById(@Param('id') id: string) {
    const request = new FindOneDirectoryRequest(parseInt(id));
    const response = await this.findOneDirectoryService.execute(request);
    if (response.isSuccess()) {
      return response.getValue();
    }
    throw response.getError();
  }
}
