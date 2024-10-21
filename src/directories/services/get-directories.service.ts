import { IService } from 'src/common/aplication/services/iservice';
import { GetAllDirectoriesRequest } from '../request/get-directories.request';
import {
  GetAllDirectoriesResponse,
  directoriesDto,
} from '../responses/get-directories.response';
import { Result } from 'src/common/result/result';
import { IDirectoryRepository } from '../repositories/directory/directory.repository.interface';
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

export class GetAllDirectoriesService
  implements IService<GetAllDirectoriesRequest, GetAllDirectoriesResponse>
{
  private readonly _directoryRepository: IDirectoryRepository;

  constructor(directoryRepository: IDirectoryRepository) {
    this._directoryRepository = directoryRepository;
  }

  async execute(
    request: GetAllDirectoriesRequest,
  ): Promise<Result<GetAllDirectoriesResponse>> {
    const limit = request.limit;
    const offset = request.offset;

    const result = await this._directoryRepository.findAllDirectories(
      limit,
      offset,
    );

    // Verificar si la consulta fue exitosa
    if (result.isFailure()) {
      // Obtener los directorios desde el resultado
      return Result.fail(result.getError()); // Usar el método getError()
    }

    const directories = result.getValue();

    // Verificar si el arreglo de directorios está vacío
    if (directories.length === 0) {
      return Result.fail(
        new HttpException('Not enough records', HttpStatus.NOT_FOUND),
      );
    }

    const directoriesDto: directoriesDto[] = directories.map((directory) => ({
      id: directory.id,
      name: directory.name,
      emails: directory.directoryEmails.map((email) => email.email),
    }));
    console.log(offset);
    console.log(parseInt(offset + '') === 0);
    const nextpage = `http://localhost:3200/api/v1/directories/${
      offset + limit
    }/${limit}`;

    const prevpage =
      offset - limit < 0
        ? 'Cannot prev yet'
        : `http://localhost:3200/api/v1/directories/${offset - limit}/${limit}`;

    return Result.success<GetAllDirectoriesResponse>(
      new GetAllDirectoriesResponse(
        directoriesDto.length,
        directoriesDto,
        nextpage,
        prevpage,
      ),
    );
  }
}
