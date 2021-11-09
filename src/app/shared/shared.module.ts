import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import UploadComponent from './upload/upload.component';
import DragAndDropDirective from './upload/directives/drag-and-drop.directive';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [UploadComponent, DragAndDropDirective, DialogComponent],
  imports: [CommonModule, MatDialogModule, MatIconModule, TranslateModule],
  exports: [UploadComponent],
})
export default class SharedModule {}
