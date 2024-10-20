export class DeleteDirectoryResponse {
    private readonly message: string;
    constructor(
        private readonly directoryid: number
    ) {
        this.message = `directory with ID ${directoryid} deleted succefully`
    }
  }  