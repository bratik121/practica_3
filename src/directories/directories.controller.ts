import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
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
  GetAllDirectoriesRequest
} from './request';
import {
  CreateDirectoryResponse,
  DeleteDirectoryResponse,
  FindOneDirectoryResponse,
  GetAllDirectoriesResponse
} from './responses';
import { DirectoryRepository } from './repositories/directory/directory.repository';
import { DirectoryEmailRepository } from './repositories/directory-email/directory-email.repository';
import { CreateDirectoryService } from './services/create-directory.service';
import { CreateDirectoryDto } from './dto';
import { FindOneDirectoryService } from './services/find-one.directory.service';
import { GetAllDirectoriesService } from './services/get-directories.service';
import { DeleteDirectoryService } from './services/delete-directory.service'; // Añadido

@Controller('directories')
@ApiTags('Directories')
export class DirectoiresController {
  // Repositorios
  private readonly _directoryRepository: IDirectoryRepository;
  private readonly _directoryEmailRepository: IDirectoryEmailRepository;

  // Servicios
  private createDirectoryService: CreateDirectoryService;
  private findOneDirectoryService: FindOneDirectoryService;
  private getAllDirectoriesService: GetAllDirectoriesService;
  private deleteDirectoryService: DeleteDirectoryService; // Añadido

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
  async getDirectoryById(@Param('id') id: number) {
    const request = new FindOneDirectoryRequest(id);
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
  async getAllDirectories(@Param('offset') offset:number, @Param('limit') limit:number) {
    console.log(offset);
    console.log(limit);
    console.log(isNaN(offset));
    const request = new GetAllDirectoriesRequest(offset,limit); // Crear una solicitud vacía
    const response = await this.getAllDirectoriesService.execute(request);
    if (response.isSuccess()) {
      return response.getValue();
    }
    throw response.getError();
  }

  @Delete(':id')
  @ApiFoundResponse({ 
    description: 'Directory deleted successfully', 
    type: DeleteDirectoryResponse // Especifica el tipo de respuesta
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
  

}
