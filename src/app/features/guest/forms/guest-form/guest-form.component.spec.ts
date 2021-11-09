import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import NgswService from '../../../../shared/services/ngsw.service';
import { GuestFormComponent } from './guest-form.component';

describe('GuestFormComponent', () => {
  let component: GuestFormComponent;
  let fixture: ComponentFixture<GuestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestFormComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        TranslateModule.forRoot(),
      ],
      providers: [NgswService, TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it(`if I call the 'submit' function , the 'submitForm' should be emitted`, () => {
    const submitFormSpy = spyOn(component['submitForm'], 'emit');
    component.submit();
    fixture.detectChanges();

    expect(submitFormSpy).toHaveBeenCalledTimes(1);
  });
});
