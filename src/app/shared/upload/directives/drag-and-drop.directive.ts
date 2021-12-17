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

import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

/**
 * Class representing the DragAndDropDirective
 */
@Directive({
  selector: '[appDragAndDrop]',
})
export default class DragAndDropDirective {
  @HostBinding('class.fileInDropArea') fileInDropArea: boolean;

  @Output() fileDropped: EventEmitter<FileList> = new EventEmitter<FileList>();

  @Output() dropAreaActive: EventEmitter<boolean> = new EventEmitter();

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileInDropArea = true;
    this.dropAreaActive.emit(true);
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileInDropArea = false;
    this.dropAreaActive.emit(false);
  }

  // Drop listener
  @HostListener('drop', ['$event']) public onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileInDropArea = false;
    this.dropAreaActive.emit(false);

    if (event.dataTransfer) {
      const { files } = event.dataTransfer;
      if (files.length > 0) {
        this.fileDropped.emit(files);
      }
    }
  }
}
