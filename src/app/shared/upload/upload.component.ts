import { Component, EventEmitter, Output } from '@angular/core';
import UploadService from './services/upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  providers: [UploadService],
})
export default class UploadComponent {
  @Output() csvFileUploaded: EventEmitter<FormData> = new EventEmitter();

  @Output() error: EventEmitter<string[]> = new EventEmitter();

  public files: FileList;

  public fileInDropArea: boolean | undefined;

  public errorMessage: Array<string> = [];

  public constructor(private readonly uploadService: UploadService) {}

  public onDropAreaActive(event: boolean): void {
    this.fileInDropArea = event;
  }

  public async fileSelectionHandler(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const uploadedFiles = input.files;

    await this.fileProcess(uploadedFiles);
  }

  public async onFileDropped(files: FileList): Promise<void> {
    await this.fileProcess(files);
  }

  private async fileProcess(files: FileList | null): Promise<void> {
    if (files && files.length === 1) {
      const file = files[0];

      this.verifyFileMimeType(file);
      this.verifyFileSize(file);
      await this.verifyEncoding(file);

      if (this.errorMessage.length === 0) {
        const formData = this.uploadService.appendFileToFormData(file);

        this.emitFormData(formData);
      } else {
        this.emitErrorMessage(this.errorMessage);
      }
    }
  }

  private emitErrorMessage(errorMessage: string[]): void {
    this.error.emit(errorMessage);
  }

  private emitFormData(formData: FormData): void {
    this.csvFileUploaded.emit(formData);
  }

  private verifyFileSize(file: File): void {
    if (!this.uploadService.isFileMaxSizeValid(file)) {
      this.errorMessage.push('Size limit exceeded.');
    } else if (!this.uploadService.isFileMinSizeValid(file)) {
      this.errorMessage.push('File is empty.');
    }
  }

  private verifyFileMimeType(file: File): void {
    if (!this.uploadService.isMimeTypeValid(file)) {
      this.errorMessage.push('Mime type is not correct.');
    }
  }

  private async verifyEncoding(file: File): Promise<void> {
    if (!(await this.uploadService.isEncodingTypeValid(file))) {
      this.errorMessage.push('Encoding is not correct.');
    }
  }
}
