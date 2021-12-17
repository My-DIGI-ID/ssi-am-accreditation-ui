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

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * Class representing the DialogComponent
 */
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  public dialogTitle: string = '';

  public dialogDescription: string = '';

  public firstButtonText: string = '';

  public secondButtonText: string = '';

  /**
   * Instantiates the DialogComponent. Sets the dialog title, description, first button text and second button text.
   * @param {MatDialogRef<DialogComponent>} dialogConfirmRef - Reference to a dialog opened via the MatDialog service.
   * @param {any} data - dialog data
   */
  public constructor(public dialogConfirmRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    this.dialogTitle = data.title;
    this.dialogDescription = data.discription;
    this.firstButtonText = data.firstButtonText;
    this.secondButtonText = data.secondButtonText;
  }

  /**
   * Closes the dialog
   * @param {string} type - dialog type
   */
  public dialogAction(type: string): void {
    this.dialogConfirmRef.close(type);
  }
}
