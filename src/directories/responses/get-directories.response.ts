import { DirectoryEntity } from 'src/directories/entities';

export class GetAllDirectoriesResponse {
  private readonly count: number;
  private readonly next: string | null;  // URL para la próxima página
  private readonly previous: string | null;  // URL para la página previa
  readonly results: {
    id: number;
    name: string;
    emails: string[];  // Cambié a string[]
  }[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    directories: { id: number; name: string; emails: string[] }[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = directories;
  }

  // Método estático para transformar la lista de entidades en una respuesta adecuada
  static fromEntities(
    entities: DirectoryEntity[],
    totalCount: number,
    offset: number,
    limit: number,
    baseUrl: string,  // Base URL para generar los links
  ): GetAllDirectoriesResponse {
    
    const directories = entities.map(entity => ({
      id: entity.id,
      name: entity.name,
      emails: entity.directoryEmails.map(email => email.email),  // Mapeo a string
    }));

    // Calcular el próximo offset
    console.log('hola2');
    console.log(isNaN(offset));
    console.log(isNaN(limit));

    const nextOffset = offset + limit;
    const prevOffset = offset - limit;

    console.log('hola');
    console.log(nextOffset);
    console.log(totalCount);

    // Crear el link de la siguiente página si hay más directorios que mostrar
    const next = nextOffset < totalCount
      ? `${baseUrl}/${nextOffset}/${limit}`
      : null;

    // Crear el link de la página anterior si el offset actual es mayor que 0
    const previous = offset > 0
      ? `${baseUrl}/${prevOffset}/${limit}`
      : null;

    return new GetAllDirectoriesResponse(totalCount, next, previous, directories);
  }
}
