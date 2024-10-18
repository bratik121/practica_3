export class CreateDirectoryResponse {
  private constructor(
    private readonly directoryId: string,
    private readonly name: string,
    private readonly directoryEmails: string[],
  ) {}
}
