import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import UploadComponent from './upload.component';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadComponent],
      imports: [TranslateModule.forRoot()],
      providers: [TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('if the onDropAreaActive function is called with a true parameter, fileInDropArea should be also true', () => {
    component.onDropAreaActive(true);

    expect(component.fileInDropArea).toBe(true);
  });

  it('if the onDropAreaActive function is called with a false parameter, fileInDropArea should be also false', () => {
    component.onDropAreaActive(false);

    expect(component.fileInDropArea).toBe(false);
  });

  it('if the fileProcess function is called with a null parameter, verifyFileMimeTypeSpy should not be called', async () => {
    const verifyFileMimeTypeSpy = spyOn<any>(component, 'verifyFileMimeType');

    // eslint-disable-next-line dot-notation
    component['fileProcess'](null);

    expect(verifyFileMimeTypeSpy).toHaveBeenCalledTimes(0);
  });

  describe('if there is at least a file', () => {
    let files: FileList;
    const file: File = new File([], 'file.csv');

    beforeEach(async () => {
      const getFileList = (): FileList => {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        return dataTransfer.files;
      };

      files = getFileList();
    });

    it('if the onFileDropped function is called with, the fileProcess should be also false', async () => {
      const fileProcessSpy = spyOn<any>(component, 'fileProcess');
      component.onFileDropped(files);

      expect(fileProcessSpy).toHaveBeenCalledTimes(1);
    });

    it('if the fileProcess function is called, verifyFileMimeType should be also called', async () => {
      const verifyFileMimeTypeSpy = spyOn<any>(component, 'verifyFileMimeType');

      // eslint-disable-next-line dot-notation
      component['fileProcess'](files);

      expect(verifyFileMimeTypeSpy).toHaveBeenCalledTimes(1);
    });

    it('if the fileProcess function is called, verifyFileSize should be also called', async () => {
      const verifyFileSizeSpy = spyOn<any>(component, 'verifyFileSize');

      // eslint-disable-next-line dot-notation
      component['fileProcess'](files);

      expect(verifyFileSizeSpy).toHaveBeenCalledTimes(1);
    });

    it('if the fileProcess function is called, verifyEncoding should be also called', async () => {
      const verifyEncodingSpy = spyOn<any>(component, 'verifyEncoding');

      // eslint-disable-next-line dot-notation
      component['fileProcess'](files);

      expect(verifyEncodingSpy).toHaveBeenCalledTimes(1);
    });
  });
});
