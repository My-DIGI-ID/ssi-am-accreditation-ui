import { TestBed } from '@angular/core/testing';
import UploadService from './upload.service';

describe('UploadService', () => {
  let service: UploadService;
  let file: File;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploadService],
    });
    service = TestBed.inject(UploadService);
    file = new File([''], 'filename', { type: 'text/csv' });
  });

  it('instance should be successfully created', () => {
    expect(service).toBeTruthy();
  });

  it('if I call the isFileSizeValid function with test file, it should be return with true', () => {
    expect(service.isFileSizeValid(file)).toEqual(true);
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

  it('if I call the isEncodingUTF8 function with test file, it should be return with false', async () => {
    const isEncoding = service.isEncodingUTF8(file).then((x) => expect(x).toEqual(false));
    expect(isEncoding).toBeDefined();
  });

  it('if I call the appendFileToFormDate with file, it should return with formData', () => {
    const formData = new FormData();
    expect(service.appendFileToFormData(file)).toEqual(formData);
  });
});
