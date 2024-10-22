import {
  Body,
  Controller,
  Patch,
  Get,
  Param,
  Post,
  Delete,
  Put,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { IDirectoryRepository } from './repositories/directory/directory.repository.interface';
import { IDirectoryEmailRepository } from './repositories/directory-email/directory-email.repository.interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  CreateDirectoryRequest,
  DeleteDirectoryRequest,
  FindOneDirectoryRequest,
  GetAllDirectoriesRequest,
  PatchDirectoryRequest,
} from './request';
import {
  CreateDirectoryResponse,
  DeleteDirectoryResponse,
  FindOneDirectoryResponse,
  GetAllDirectoriesResponse,
  PatchDirectoryResponse,
} from './responses';
import { DirectoryRepository } from './repositories/directory/directory.repository';
import { DirectoryEmailRepository } from './repositories/directory-email/directory-email.repository';
import { CreateDirectoryService } from './services/create-directory.service';
import { CreateDirectoryDto, PatchDirectoryDto } from './dto';
import { FindOneDirectoryService } from './services/find-one.directory.service';
import { GetAllDirectoriesService } from './services/get-directories.service';
import { DeleteDirectoryService } from './services/delete-directory.service'; // Añadido
import { UpdateDirectoryService } from './services/update-directories.service'; //nuevo
import { IService } from 'src/common/aplication/services/iservice';
import { UpdateDirectoryRequest } from './request/update-directories-requests';
import { UpdateDirectoryResponse } from './responses/update-directories-responses';
import { UpdateDirectoryDto } from './dto/update-directory.dto';
import { PatchDirectoryService } from './services/patch-directory.service';

@Controller('directories')
@ApiTags('Directories')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class DirectoiresController {
  // Repositorios
  private readonly _directoryRepository: IDirectoryRepository;
  private readonly _directoryEmailRepository: IDirectoryEmailRepository;
  //private readonly _directoriesService: IDDirectoriesService; //nuevo

  // Servicios
  private createDirectoryService: IService<
    CreateDirectoryRequest,
    CreateDirectoryResponse
  >;
  private findOneDirectoryService: IService<
    FindOneDirectoryRequest,
    FindOneDirectoryResponse
  >;
  private getAllDirectoriesService: IService<
    GetAllDirectoriesRequest,
    GetAllDirectoriesResponse
  >;
  private deleteDirectoryService: IService<
    DeleteDirectoryRequest,
    DeleteDirectoryResponse
  >; // Añadido
  private updateDirectoryService: IService<
    UpdateDirectoryRequest,
    UpdateDirectoryResponse
  >; //nuevo

  private patchDirectoryService: IService<
    PatchDirectoryRequest,
    PatchDirectoryResponse
  >;

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    // Repositorios
    this._directoryRepository = new DirectoryRepository(this.entityManager);
    this._directoryEmailRepository = new DirectoryEmailRepository(
      this.entityManager,
    );

    // Servicios
    this.createDirectoryService = new CreateDirectoryService(
      this._directoryRepository,
      this._directoryEmailRepository,
    );

    this.findOneDirectoryService = new FindOneDirectoryService(
      this._directoryRepository,
      this._directoryEmailRepository,
    );

    this.getAllDirectoriesService = new GetAllDirectoriesService(
      this._directoryRepository,
    );

    this.deleteDirectoryService = new DeleteDirectoryService(
      this._directoryRepository,
      this._directoryEmailRepository,
    ); // Añadido

    this.updateDirectoryService = new UpdateDirectoryService(
      this._directoryRepository,
      this._directoryEmailRepository,
    );

    this.patchDirectoryService = new PatchDirectoryService(
      this._directoryRepository,
      this._directoryEmailRepository,
    );
  }

  // Crear un nuevo directorio
  @Post()
  @ApiCreatedResponse({ description: 'Directory created successfully' })
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

  // Obtener un directorio por ID
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

  // Obtener todos los directorios
  @Get(':offset/:limit')
  @ApiFoundResponse({ description: 'All directories retrieved successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async getAllDirectories(
    @Param('offset') offset: string,
    @Param('limit') limit: string,
  ) {
    const request = new GetAllDirectoriesRequest(
      parseInt(offset),
      parseInt(limit),
    ); // Crear una solicitud vacía
    const response = await this.getAllDirectoriesService.execute(request);
    if (response.isSuccess()) {
      return response.getValue();
    }
    throw response.getError();
  }

  @Delete(':id')
  @ApiFoundResponse({
    description: 'Directory deleted successfully',
    type: DeleteDirectoryResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Directory not found' })
  async deleteDirectory(@Param('id') id: string) {
    const request = new DeleteDirectoryRequest(parseInt(id));
    const response = await this.deleteDirectoryService.execute(request);
    if (response.isSuccess()) {
      return response.getValue(); // Retornar la respuesta directamente
    }
    throw response.getError();
  }
  ///nuevo
  @Put(':id')
  async updateDirectory(
    @Param('id') id: string,
    @Body() updateData: UpdateDirectoryDto,
  ) {
    const request = new UpdateDirectoryRequest(
      parseInt(id),
      updateData.name,
      updateData.emails,
    );
    const response = await this.updateDirectoryService.execute(request);
    if (response.isSuccess()) {
      return response.getValue();
    }
    throw response.getError();
  }

  @Patch(':id')
  @ApiFoundResponse({ description: 'Directory partially updated' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Directory not found' })
  async partialUpdateDirectory(
    @Param('id') id: string,
    @Body() body: PatchDirectoryDto,
  ) {
    const request = new PatchDirectoryRequest(
      parseInt(id),
      body.name,
      body.emails,
    );
    const response = await this.patchDirectoryService.execute(request);
    if (response.isSuccess()) {
      return response.getValue();
    }
    throw response.getError();
  }
}
