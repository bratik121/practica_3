import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IService } from 'src/common/application/services/iservice';
import { UpdateDirectoryRequest } from '../request/update-directories-requests';
import { UpdateDirectoryResponse } from '../responses/update-directories-responses';
import { Result } from 'src/common/result/result';
import { IDirectoryRepository } from '../repositories/directory/directory.repository.interface';
import { IDirectoryEmailRepository } from '../repositories/directory-email/directory-email.repository.interface';
import { DirectoryEntity } from '../entities';
import { DeleteDirectoryService } from '../services/delete-directory.service';

@Injectable()
export class DirectoriesService {
  constructor(
    private readonly directoryEmailRepository: IDirectoryEmailRepository,
    private readonly directoryRepository: IDirectoryRepository,
  ) {}

  private directories = [];

  async partialUpdate(id: string, updateData: UpdateDirectoryRequest) {
    const directory = await this.directoryRepository.findDirectoryById(id);
    if (!directory) {
      throw new HttpException(`Directory with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    if (updateData.name) {
      directory.name = updateData.name;
    }

    if (updateData.directoryEmails) {
      const existingEmails = await this.directoryEmailRepository.findByDirectoryId(id);
      const emailsToRemove = existingEmails.filter(email => !updateData.directoryEmails.includes(email));
      const emailsToAdd = updateData.directoryEmails.filter(email => !existingEmails.includes(email));

      for (const email of emailsToRemove) {
        await this.directoryEmailRepository.deleteEmail(id, email);
      }

      for (const email of emailsToAdd) {
        await this.directoryEmailRepository.saveEmail(id, email);
      }
    }

    const updatedDirectory = await this.directoryRepository.saveDirectory(directory);
    return updatedDirectory;
  }
}
