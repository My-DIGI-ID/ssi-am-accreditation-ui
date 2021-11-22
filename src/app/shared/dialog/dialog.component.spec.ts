import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule],
      providers: [
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: { myData: {} } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('dialogAction function is called, the function that closes the dialog should be triggered', () => {
    const closeSpy = spyOn(component.dialogConfirmRef, 'close');
    component.dialogAction('close');

    expect(closeSpy).toHaveBeenCalled();
  });
});
