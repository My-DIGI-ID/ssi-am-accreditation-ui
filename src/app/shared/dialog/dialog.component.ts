import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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

  public constructor(public dialogConfirmRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    this.dialogTitle = data.title;
    this.dialogDescription = data.discription;
    this.firstButtonText = data.firstButtonText;
    this.secondButtonText = data.secondButtonText;
  }

  public dialogAction(type: string): void {
    this.dialogConfirmRef.close(type);
  }
}
