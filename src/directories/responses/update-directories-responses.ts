export class UpdateDirectoryResponse {
  constructor(
    private readonly directoryId: number,
    private readonly name: string,
    private readonly directoryEmails: string[],
  ) {}
}
