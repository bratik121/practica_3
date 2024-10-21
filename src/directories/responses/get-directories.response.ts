import { DirectoryEntity } from 'src/directories/entities';

export type directoriesDto = {
  id: number;
  name: string;
  emails: string[]; // Cambié a string[]
};

export class GetAllDirectoriesResponse {
  private readonly count: number;
  private readonly next: string; // URL para la próxima página
  private readonly prev: string; // URL para la página previa
  private readonly results: directoriesDto[];

  constructor(
    count: number,
    directories: directoriesDto[],
    next: string,
    prev: string,
  ) {
    this.count = count;
    this.results = directories;
    this.next = next;
    this.prev = prev;
  }

  //return new GetAllDirectoriesResponse(totalCount, directories);
}
