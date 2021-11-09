import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import NgswService from '../../../../shared/services/ngsw.service';
import EmployeeFormComponent from './employee-form.component';

describe('Employee Form Component', () => {
  let component: EmployeeFormComponent;
  let fixture: ComponentFixture<EmployeeFormComponent>;
  const initialValue = {
    firstName: '',
    lastName: '',
    primaryPhone: '',
    secondaryPhone: '',
    title: '',
    email: '',
    employeeStatus: '',
    employeeRole: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeFormComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        TranslateModule.forRoot(),
      ],
      providers: [NgswService, TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;
    component.initialValue = initialValue;

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it(`if I call the 'submitEmployee' function, 'submitForm' should be emitted`, () => {
    const submitFormSpy = spyOn(component['submitForm'], 'emit');
    component.submitEmployee();
    fixture.detectChanges();

    expect(submitFormSpy).toHaveBeenCalledTimes(1);
  });
});
