import { Result } from 'src/common/result/result';
import { DirectoryEmailEntity } from 'src/directories/entities';

export interface IDirectoryEmailRepository {
  saveEmail(
    id_directory: number,
    email: string,
  ): Promise<Result<DirectoryEmailEntity>>;
  findOneByEmail(email: string): Promise<Result<DirectoryEmailEntity>>;
  findEmailsByDirectoryId(id: number): Promise<Result<DirectoryEmailEntity[]>>;
  deleteDirectoryEmail(
    directoryEmail: DirectoryEmailEntity,
  ): Promise<Result<void>>;
}
