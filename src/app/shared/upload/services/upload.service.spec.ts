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

import { TestBed } from '@angular/core/testing';
import UploadService from './upload.service';

describe('UploadService', () => {
  let service: UploadService;
  let file: File;
  let fileEmpty: File;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploadService],
    });
    service = TestBed.inject(UploadService);
    file = new File(['1'], 'filename', { type: 'text/csv' });
    fileEmpty = new File([], 'filename', { type: 'text/csv' });
  });

  it('instance should be successfully created', () => {
    expect(service).toBeTruthy();
  });

  it('if I call the isFileMaxSizeValid function with test file, it should be return with true', () => {
    expect(service.isFileMaxSizeValid(file)).toEqual(true);
  });

  it('if I call the isFileMinSizeValid function with test file, it should be return with true', () => {
    expect(service.isFileMinSizeValid(file)).toEqual(true);
  });

  it('if I call the isFileMinSizeValid function with test fileEmpty, it should be return with false', () => {
    expect(service.isFileMinSizeValid(fileEmpty)).toEqual(false);
  });

  it('if I call the isMimeTypeValid function with test file, it should be return with true', () => {
    expect(service.isMimeTypeValid(file)).toEqual(true);
  });
  it('if I call the isMimeTypeValid function with test file2, and file3, it should be return with false', () => {
    const file2 = new File([''], 'filename.ts', { type: '' });
    const file3 = new File([''], 'filename', { type: '' });

    expect(service.isMimeTypeValid(file2)).toEqual(false);
    expect(service.isMimeTypeValid(file3)).toEqual(false);
  });

  it('if I call the isEncodingTypeValid function with test file, it should be return with true', async () => {
    const isEncoding = service.isEncodingTypeValid(file).then((x) => expect(x).toEqual(true));

    expect(isEncoding).toBeDefined();
  });

  it('if I call the appendFileToFormDate with file, it should return with formData', () => {
    const formData = new FormData();
    expect(service.appendFileToFormData(file)).toEqual(formData);
  });
});
