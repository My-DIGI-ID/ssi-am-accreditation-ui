import { HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import EmployeeApiModel from 'features/employee/models/employee-api.model';
import EmployeeFormModel from 'features/employee/models/employee-form.model';
import EmployeeViewModel from 'features/employee/models/employee-view.model';
import { map } from 'rxjs/operators';
import AbstractStore from 'shared/abstractions/store.abstract';
import EmployeeApiService from '../api/employee.api.service';

/**
 * The purpose of this service is to hold the golden source of view data for entity
 * And being a mediator between views and higher level services
 * Handles side effects and data mutations
 * Though does NOT contain any mapping logic itself
 */
@Injectable({
  providedIn: 'root',
})
export default class EmployeeStoreService extends AbstractStore<EmployeeViewModel[]> {
  constructor(private employeeApiService: EmployeeApiService, private router: Router) {
    super();
  }

  handleEmployeeCreation(employeeFormModel: EmployeeFormModel) {
    const newEmployeeApiModel = new EmployeeApiModel();
    newEmployeeApiModel.firstName = employeeFormModel.firstName;
    newEmployeeApiModel.lastName = employeeFormModel.lastName;
    newEmployeeApiModel.companyCity = employeeFormModel.firmCity;
    newEmployeeApiModel.companyName = employeeFormModel.firmName;
    newEmployeeApiModel.companyStreet = employeeFormModel.firmStreet;
    newEmployeeApiModel.email = employeeFormModel.email;
    newEmployeeApiModel.companyPostalCode = employeeFormModel.firmPostalCode;
    newEmployeeApiModel.title = employeeFormModel.title;
    newEmployeeApiModel.primaryPhoneNumber = employeeFormModel.primaryPhone;
    newEmployeeApiModel.secondaryPhoneNumber = employeeFormModel.secondaryPhone;
    newEmployeeApiModel.employeeState = employeeFormModel.employeeStatus;
    newEmployeeApiModel.companyReference = employeeFormModel.firmReference;
    newEmployeeApiModel.employeeId = employeeFormModel.employeeId;
    this.addEmployee(newEmployeeApiModel);
  }

  handleCSVUpload(formData: FormData): void {
    this.employeeApiService.saveEmployeeCSV(formData).subscribe(
      (response: HttpEvent<any>) => {
        if (response instanceof HttpResponse) {
          if (response.status === 200) {
            this.storeSubject.next(this.update(response.body));
            this.handleOnResponse(true, response.body);
          }
        }
      },
      (error: Error) => {
        console.error('Error', error);
        this.handleOnResponse(false, error);
      }
    );
  }

  protected buildStore(..._args: any): any {
    return this.employeeApiService
      .getEmployees()
      .pipe(map((apiModel: EmployeeApiModel[]) => apiModel.map((el) => Object.assign(new EmployeeViewModel(), el))));
  }

  public addEmployee(employee: EmployeeApiModel): void {
    this.employeeApiService.saveEmployee(employee).subscribe(
      (response: EmployeeViewModel) => {
        this.storeSubject.next(this.update(response));
        this.handleOnResponse(true, [response]);
      },
      (error: any) => {
        console.error('Error', error);
        this.handleOnResponse(false, error);
      }
    );
  }

  public fetchEmployees(): void {
    this.employeeApiService.getEmployees().subscribe(
      (response) => this.storeSubject.next(this.update(response)),
      (error) => console.error('Error', error)
    );
  }

  private update(data: EmployeeViewModel | EmployeeViewModel[]): EmployeeViewModel[] {
    if (Array.isArray(data)) {
      this.storeSubject.value.push(Object.assign(new EmployeeViewModel(), data));
      return this.storeSubject.value;
    }
    this.storeSubject.value.push(data);

    return this.storeSubject.value;
  }

  private handleOnResponse(status: boolean, responseData: Error | EmployeeViewModel[]): void {
    this.router.navigate(['/employee/creation-status'], {
      state: {
        success: status,
        data: responseData,
      },
    });
  }
}
