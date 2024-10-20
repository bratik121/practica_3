import { IService } from 'src/common/aplication/services/iservice';
import { GetAllDirectoriesRequest } from '../request/get-directories.request';
import { GetAllDirectoriesResponse } from '../responses/get-directories.response';
import { Result } from 'src/common/result/result';
import { IDirectoryRepository } from '../repositories/directory/directory.repository.interface';
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';


export class GetAllDirectoriesService implements IService<
  GetAllDirectoriesRequest,
  GetAllDirectoriesResponse
> {
  private readonly _directoryRepository: IDirectoryRepository;

  constructor(directoryRepository: IDirectoryRepository) {
    this._directoryRepository = directoryRepository;
  }

  async execute(
    request: GetAllDirectoriesRequest,
  ): Promise<Result<GetAllDirectoriesResponse>> {
    console.log(request.offset,request.limit);

    try {
      // Obtener todos los directorios desde el repositorio
      
      const result = await this._directoryRepository.findAllDirectories(request.limit,request.offset);
      
      // Verificar si la consulta fue exitosa
      if (result.isSuccess) {
        // Obtener los directorios desde el resultado
        const directories = result.getValue();
        
        // Verificar si el arreglo de directorios está vacío
        if (directories.length === 0) {
          // Retornar un fallo indicando que no se encontraron directorios
          return Result.fail(new Error('No directories found'));
        }
        
        // Crear la respuesta utilizando el método estático `fromEntities`
        const response = GetAllDirectoriesResponse.fromEntities(directories,directories.length,request.offset,request.limit,'http://localhost:3200/api/v1/directories');
        
        // Retornar el resultado exitoso con la respuesta
        return Result.success(response);
      } else {
        // Si hubo un error en el repositorio, usar el método público para obtener el error
        return Result.fail(result.getError());  // Usar el método getError()
      }
    } catch (error) {
      // Manejo de errores en caso de fallo inesperado
      return Result.fail(
        new Error(`Error fetching directories: ${error.message}`),
      );
    }
  }
  
}
