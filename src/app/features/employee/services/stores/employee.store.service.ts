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

import { HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import AbstractStore from '../../../../shared/abstractions/store.abstract';
import EmployeeViewModel from '../../models/employee-view.model';
import EmployeeFormModel from '../../models/employee-form.model';
import EmployeeApiModel from '../../models/employee-api.model';
import EmployeeApiService from '../api/employee.api.service';

/**
 * The purpose of this service is to hold the golden source of view data for entity
 * And being a mediator between views and higher level services
 * Handles side effects and data mutations
 * Though does NOT contain any mapping logic itself
 * @extends AbstractStore
 */
@Injectable({
  providedIn: 'root',
})
export default class EmployeeStoreService extends AbstractStore<EmployeeViewModel[]> {
  /**
   * Instantiates the EmployeeDetailStoreService
   * @param {EmployeeApiService} employeeApiService - Service containing employee API related functions
   * @param {Router} router - A service that provides navigation among views and URL manipulation capabilities.
   */
  constructor(private employeeApiService: EmployeeApiService, private router: Router) {
    super();
  }

  /**
   * Handles the employee creation, namely saves the employee after having the full form
   * @param {EmployeeFormModel} employeeFormModel - employee form
   */
  public handleEmployeeCreation(employeeFormModel: EmployeeFormModel): void {
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

  /**
   * Handles the CSV upload, namely tries to save the employee based on the CSV input
   * @param {FormData} formData - employee form
   */
  public handleCSVUpload(formData: FormData): void {
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

  /**
   * Builds the store - retrieves the employees and maps them to the view mode
   * @param {any} _args - args
   * @return {any} employees
   */
  protected buildStore(..._args: any): any {
    return this.employeeApiService
      .getEmployees()
      .pipe(map((apiModel: EmployeeApiModel[]) => apiModel.map((el) => Object.assign(new EmployeeViewModel(), el))));
  }

  /**
   * Saves the given employee and handles the response, be it a successful response or an error response
   * @param {EmployeeApiModel} employee - employee
   */
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

  /**
   * Retrieves employees through the EmployeeAPIService
   */
  public fetchEmployees(): void {
    this.employeeApiService.getEmployees().subscribe(
      (response) => this.storeSubject.next(this.update(response)),
      (error) => console.error('Error', error)
    );
  }

  /**
   * Updates the store subject with the given data
   * @param {EmployeeViewModel | EmployeeViewModel[]} data - update data
   * @return {EmployeeViewModel[]} store subject value
   */
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
