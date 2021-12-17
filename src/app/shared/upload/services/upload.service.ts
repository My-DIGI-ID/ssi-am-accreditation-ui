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

import * as Encoding from 'encoding-japanese';

/**
 * Class representing the UploadService
 */
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

  /**
   * Checks if the given file's size is smaller than the upper size limit
   * @param {File} file - csv
   * @return {boolean} file size validity
   */
  public isFileMaxSizeValid(file: File): boolean {
    return file.size <= this.fileSizeLimit;
  }

  /**
   * Checks if the given file's size is bigger than the lower size limit
   * @param {File} file - csv
   * @return {boolean} file size validity
   */
  public isFileMinSizeValid(file: File): boolean {
    return file.size > 0;
  }

  /**
   * Checks if the given file's Mime type is valid
   * @param {File} file - csv
   * @return {boolean} file type validity
   */
  public isMimeTypeValid(file: File): boolean {
    let fileMimeType = file.type;

    if (fileMimeType === '' || typeof fileMimeType === 'undefined') {
      fileMimeType = this.getFileTypeFromName(file.name);
    }

    return this.acceptedFileMimeTypes.indexOf(fileMimeType) > -1;
  }

  /**
   * Checks if the encoding type of the file is valid
   * @param {File} file - csv
   * @return {boolean} file encoding type validity
   */
  public async isEncodingTypeValid(file: File): Promise<boolean> {
    if (!this.isFileMinSizeValid(file)) {
      return Promise.resolve(true);
    }
    const encoding = await this.getEncoding(file);

    return encoding === 'UTF8' || encoding === 'ASCII' || encoding === 'SJIS';
  }

  /**
   * Adds the file to the form data
   * @param {File} file - csv
   * @return {FormData} form data
   */
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
