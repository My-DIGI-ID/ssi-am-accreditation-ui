/*
 * Copyright 2021 Bundesrepublik Deutschland
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, EventEmitter, Output } from '@angular/core';
import UploadService from './services/upload.service';

/**
 * Class representing the UploadComponent
 */
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

  /**
   * Instantiates the UploadComponent
   * @param {UploadService} uploadService - service for csv upload
   */
  public constructor(private readonly uploadService: UploadService) {}

  /**
   * Sets a variable to know that the file is in the drop area
   * @param {boolean} event - file in the drop area event
   */
  public onDropAreaActive(event: boolean): void {
    this.fileInDropArea = event;
  }

  /**
   * If the file is selected it triggers the file processing as a promise
   * @param {Event} event - event
   * @return {Promise<void>} - file processing
   */
  public async fileSelectionHandler(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const uploadedFiles = input.files;

    await this.fileProcess(uploadedFiles);
  }

  /**
   * If files are dropped, it triggers the files processing as a promise
   * @param {FileList} files - list of files
   * @return {Promise<void>} - processing
   */
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
