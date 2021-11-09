import * as Encoding from 'encoding-japanese';

/* eslint-disable class-methods-use-this */
export default class UploadService {
  public readonly acceptedFileExtension: string = '.csv';

  private readonly fileSizeLimit: number = 1024 * 1024 * 5;

  private readonly acceptedFileMimeTypes: string[] = [
    'csv',
    'text/csv',
    'text/plain',
    'text/x-csv',
    'text/comma-separated-values',
    'text/x-comma-separated-values',
    'text/tab-separated-values',
    'application/vnd.ms-excel',
    'application/csv',
    'application/x-csv',
  ];

  public isFileSizeValid(file: File): boolean {
    return file.size <= this.fileSizeLimit;
  }

  public isMimeTypeValid(file: File): boolean {
    let fileMimeType = file.type;

    if (fileMimeType === '' || typeof fileMimeType === 'undefined') {
      fileMimeType = this.getFileTypeFromName(file.name);
    }

    return this.acceptedFileMimeTypes.indexOf(fileMimeType) > -1;
  }

  public async isEncodingUTF8(file: File): Promise<boolean> {
    return (await this.getEncoding(file)) === 'UTF8' || (await this.getEncoding(file)) === 'ASCII';
  }

  public appendFileToFormData(file: File): FormData {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return formData;
  }

  private getFileTypeFromName(fileName: string): string {
    const fileExtensionRegex = /(\.[^.]+)$/;
    const fileExtension = fileExtensionRegex.exec(fileName);

    if (fileExtension) {
      return fileExtension[0] === this.acceptedFileExtension ? this.acceptedFileMimeTypes[0] : '';
    }

    return '';
  }

  private async getEncoding(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const codes = new Uint8Array(event.target?.result as ArrayBuffer);
        const detectedEncoding = Encoding.detect(codes);

        resolve(detectedEncoding.toString());
      };

      reader.readAsArrayBuffer(file);
    });
  }
}
