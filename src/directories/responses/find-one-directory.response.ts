export class FindOneDirectoryResponse {
  constructor(
    public id: number,
    public name: string,
    public emails: string[],
  ) {}
}
