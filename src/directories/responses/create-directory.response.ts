export class CreateDirectoryResponse {
  constructor(
    private readonly directoryId: number,
    private readonly name: string,
    private readonly directoryEmails: string[],
  ) {}
}
