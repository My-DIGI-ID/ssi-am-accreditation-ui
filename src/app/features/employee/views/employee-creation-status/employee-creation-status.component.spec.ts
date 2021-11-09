/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import EmployeeCreationStatusComponent from './employee-creation-status.component';
import Spy = jasmine.Spy;

describe('EmployeeCreationStatusComponent', () => {
  let component: EmployeeCreationStatusComponent;
  let fixture: ComponentFixture<EmployeeCreationStatusComponent>;
  let router: Router;
  let routerSpy: Spy;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeCreationStatusComponent],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'creation-status', component: EmployeeCreationStatusComponent }]),
        MatIconModule,
        MatRippleModule,
        MatButtonModule,
        TranslateModule.forRoot(),
      ],
      providers: [TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    translateService = TestBed.inject(TranslateService);
    router = TestBed.inject(Router);
    router.initialNavigation();
    fixture = TestBed.createComponent(EmployeeCreationStatusComponent);
    component = fixture.componentInstance;
    routerSpy = spyOn(component['router'], 'navigateByUrl');

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it(`if I call the 'goToAddEmployee' function, I should be taken to the employee/add-employee page`, () => {
    component.goToAddEmployee();

    expect(routerSpy).toHaveBeenCalledOnceWith('employee/add-employee');
  });

  it(`if I call the 'goToDashboard' function, I should be taken to the employee/dashboard page`, () => {
    component.goToDashboard();

    expect(routerSpy).toHaveBeenCalledOnceWith('employee/dashboard');
  });

  describe('if adding an employee was successful', () => {
    beforeEach(() => {
      router.getCurrentNavigation = jasmine.createSpy().and.returnValue({
        extras: {
          state: {
            success: true,
            data: [
              {
                companyCity: 'London',
                companyName: 'TheCompany',
                companyPostalCode: '10001',
                companyStreet: 'BakerStreet',
                createdAt: 1635016185522,
                createdBy: 'hr-admin-01',
                email: 'test@example.com',
                employeeId: 'asdfgljhlh-123445',
                employeeState: 'INTERNAL',
                firstName: 'Test',
                id: '61745df97528285f118723b4',
                lastName: 'Dummy',
                position: 'Consultant',
                primaryPhoneNumber: '123456789',
                secondaryPhoneNumber: '987654321',
                title: 'Mr.',
              },
            ],
          },
        },
      });
      fixture = TestBed.createComponent(EmployeeCreationStatusComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('the initializer function should be called in constructor', () => {
      expect(router.getCurrentNavigation).toHaveBeenCalled();
    });

    it('navigation state extras success should be true', () => {
      expect(component.navigationState.extras.state.success).toEqual(true);
    });

    it('employee should get the data from navigation state extras', () => {
      expect(component.employees).toEqual(component.navigationState.extras.state.data);
    });

    it('errorMessage should be empty', () => {
      expect(component.errorMessage).toBeUndefined();
    });

    it('header text should get the success header text', () => {
      const successHeaderText = translateService.instant('employee.employee-creation-status-component.success.header');

      expect(component.getHeaderText()).toEqual(successHeaderText);
    });

    it('description text should get the success text', () => {
      const successText = translateService.instant('employee.employee-creation-status-component.success.text');

      expect(component.getStatusText()).toEqual(successText);
    });
  });
  describe('if the add employee was unsuccessful', () => {
    beforeEach(() => {
      router.getCurrentNavigation = jasmine.createSpy().and.returnValue({
        extras: {
          state: {
            success: false,
            data: 'Validation failed: must not be empty',
          },
        },
      });
      fixture = TestBed.createComponent(EmployeeCreationStatusComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('the initializer function should be called in the constructor', () => {
      expect(router.getCurrentNavigation).toHaveBeenCalled();
    });

    it('navigation state extras success should be false', () => {
      expect(component.navigationState.extras.state.success).toEqual(false);
    });

    it('employee should be empty', () => {
      expect(component.employees).toEqual([]);
    });

    it('errorMessage should get the text from navigation state extras ', () => {
      expect(component.errorMessage).toEqual(component.navigationState.extras.state.data);
    });

    it('header text should get the error header text', () => {
      const errorHeaderText = translateService.instant('employee.employee-creation-status-component.error.header');

      expect(component.getHeaderText()).toEqual(errorHeaderText);
    });

    it('description text should get the error text', () => {
      const errorText = translateService.instant('employee.employee-creation-status-component.error.text');

      expect(component.getStatusText()).toEqual(errorText);
    });
  });
});
