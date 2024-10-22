export class PatchDirectoryRequest {
  constructor(
    public readonly id: number,
    public readonly name?: string,
    public readonly directoryEmails?: string[],
  ) {}
}
