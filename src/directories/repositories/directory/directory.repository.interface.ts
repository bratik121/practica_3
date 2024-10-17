import { Result } from 'src/common/result/result';
import { DirectoryEntity } from 'src/directories/entities';

export interface IDirectoryRepository {
  saveDirectory(directory: DirectoryEntity): Promise<Result<DirectoryEntity>>;
  findDirectoryById(id: number): Promise<Result<DirectoryEntity>>;
  findAllDirectories(): Promise<Result<DirectoryEntity[]>>;
  updateDirectory(directory: DirectoryEntity): Promise<Result<DirectoryEntity>>;
  deleteDirectory(directory: DirectoryEntity): Promise<Result<void>>;
}
