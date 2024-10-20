import { IService } from "src/common/aplication/services/iservice";
import { DeleteDirectoryRequest } from "../request";
import { DeleteDirectoryResponse } from "../responses";
import { Result } from "src/common/result/result";
import { IDirectoryRepository } from "../repositories/directory/directory.repository.interface";
import { IDirectoryEmailRepository } from "../repositories/directory-email/directory-email.repository.interface";
import { HttpException, HttpStatus } from "@nestjs/common";

export class DeleteDirectoryService implements IService<
  DeleteDirectoryRequest,
  DeleteDirectoryResponse
> {
  private readonly _directoryRepository: IDirectoryRepository;
  private readonly _directoryEmailRepository: IDirectoryEmailRepository;

  constructor(
    directoryRepository: IDirectoryRepository,
    directoryEmailRepository: IDirectoryEmailRepository,
  ) {
    this._directoryRepository = directoryRepository;
    this._directoryEmailRepository = directoryEmailRepository;
  }

  async execute(
    request: DeleteDirectoryRequest,
  ): Promise<Result<DeleteDirectoryResponse>> {
    // 1. Verificar si el directorio existe
    const directoryResult = await this._directoryRepository.findDirectoryById(
      request.directoryId,
    );
    if (!directoryResult.isSuccess()) {
      return Result.fail(
        new HttpException(
          `Directory with ID ${request.directoryId} not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
    }
    const directory = directoryResult.getValue();
    
    // 2. Verificar si el directorio tiene emails
    const emailsResult = await this._directoryEmailRepository.findEmailsByDirectoryId(
      request.directoryId,
    );
    if (!emailsResult.isSuccess()) {
      return Result.fail(
        new HttpException(
          `No emails found for directory with ID ${request.directoryId}`,
          HttpStatus.NOT_FOUND,
        ),
      );
    }
    const emails = emailsResult.getValue();

    // 3. Eliminar los emails asociados al directorio
    for (const email of emails) {
      const deleteEmailResult = await this._directoryEmailRepository.deleteDirectoryEmail(
        email,
      );
      if (!deleteEmailResult.isSuccess()) {
        return Result.fail(
          new HttpException(
            `Failed to delete email with ID ${email.id}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    }

    // 4. Eliminar el directorio
    const deleteDirectoryResult = await this._directoryRepository.deleteDirectory(
      directory,
    );
    if (!deleteDirectoryResult.isSuccess()) {
      return Result.fail(
        new HttpException(
          `Failed to delete directory with ID ${request.directoryId}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }

    // 5. Retornar la respuesta exitosa
    return Result.success(new DeleteDirectoryResponse(request.directoryId));
  }
}
