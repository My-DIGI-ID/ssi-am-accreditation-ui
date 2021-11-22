import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import DragAndDropDirective from './drag-and-drop.directive';

describe('DragAndDropDirective', () => {
  let directive: DragAndDropDirective;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [DragAndDropDirective],
    });
    directive = TestBed.inject(DragAndDropDirective);
  });

  it('instance should be created', () => {
    expect(directive).toBeTruthy();
  });

  it('the onDragOver function should fire the preventDefault function from the event', () => {
    const event = new DragEvent('dragover');
    const preventDefaultSpy = spyOn(event, 'preventDefault').and.callThrough();
    directive.onDragOver(event);

    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
  });

  it('the onDragOver function should fire the stopPropagation function from the event', () => {
    const event = new DragEvent('dragover');
    const stopPropagationSpy = spyOn(event, 'stopPropagation').and.callThrough();
    directive.onDragOver(event);

    expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
  });

  it('the onDragOver function should set the fileInDropArea to true', () => {
    const event = new DragEvent('dragover');
    directive.onDragOver(event);

    expect(directive.fileInDropArea).toEqual(true);
  });

  it('the onDragOver function should emit dropAreaActive as true', () => {
    const event = new DragEvent('dragover');
    const dropAreaActiveSpy = spyOn(directive.dropAreaActive, 'emit').and.callThrough();

    directive.onDragOver(event);

    expect(dropAreaActiveSpy).toHaveBeenCalledWith(true);
  });

  it('the onDragLeave function should fire the preventDefault function from the event', () => {
    const event = new DragEvent('dragleave');
    const preventDefaultSpy = spyOn(event, 'preventDefault').and.callThrough();
    directive.onDragLeave(event);

    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
  });

  it('the onDragLeave function should fire the stopPropagation function from the event', () => {
    const event = new DragEvent('dragleave');
    const stopPropagationSpy = spyOn(event, 'stopPropagation').and.callThrough();
    directive.onDragLeave(event);

    expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
  });

  it('the onDragLeave function should set the fileInDropArea to false', () => {
    const event = new DragEvent('dragleave');
    directive.onDragLeave(event);

    expect(directive.fileInDropArea).toEqual(false);
  });

  it('the onDragLeave function should emit dropAreaActive as false', () => {
    const event = new DragEvent('dragleave');
    const dropAreaActiveSpy = spyOn(directive.dropAreaActive, 'emit').and.callThrough();

    directive.onDragLeave(event);

    expect(dropAreaActiveSpy).toHaveBeenCalledWith(false);
  });

  it('the onDrop function should fire the preventDefault function from the event', () => {
    const event = new DragEvent('drop');
    const preventDefaultSpy = spyOn(event, 'preventDefault').and.callThrough();
    directive.onDrop(event);

    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
  });

  it('the onDrop function should fire the stopPropagation function from the event', () => {
    const event = new DragEvent('drop');
    const stopPropagationSpy = spyOn(event, 'stopPropagation').and.callThrough();
    directive.onDrop(event);

    expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
  });

  it('the onDrop function should set the fileInDropArea to false', () => {
    const event = new DragEvent('drop');
    directive.onDrop(event);

    expect(directive.fileInDropArea).toEqual(false);
  });

  it('the onDrop function should not emit fileDropped if there is no dataTransfer property on event', () => {
    const event = new DragEvent('drop');
    const fileDroppedSpy = spyOn(directive.fileDropped, 'emit').and.callThrough();

    directive.onDrop(event);

    expect(fileDroppedSpy).toHaveBeenCalledTimes(0);
  });

  it('the onDrop function should not emit fileDropped if there is a dataTransfer property on event with no files', () => {
    const event = new DragEvent('drop', { dataTransfer: new DataTransfer() });
    const fileDroppedSpy = spyOn(directive.fileDropped, 'emit').and.callThrough();

    directive.onDrop(event);

    expect(fileDroppedSpy).toHaveBeenCalledTimes(0);
  });

  it('the onDrop function should emit fileDropped if there is a dataTransfer property on the event, populated with files', () => {
    const file: File = new File([], 'file.csv');
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const event = new DragEvent('drop', { dataTransfer });
    const fileDroppedSpy = spyOn(directive.fileDropped, 'emit').and.callThrough();

    directive.onDrop(event);

    expect(fileDroppedSpy).toHaveBeenCalledTimes(1);
  });
});
