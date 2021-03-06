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

// eslint-disable-next-line import/no-extraneous-dependencies
/* eslint-disable class-methods-use-this */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import EmployeeAccreditationApiModel from '../../models/employee-accreditation-api.model';
import EmployeeDashboardViewModel from '../../models/employee-dashboard-view.model';
import AbstractStore from '../../../../shared/abstractions/store.abstract';
import EmployeeApiService from '../api/employee.api.service';
import EmployeeApiModel from '../../models/employee-api.model';

/**
 * Class representing the EmployeeDashboardStoreService
 * @extends AbstractStore
 */
@Injectable({
  providedIn: 'root',
})
export default class EmployeeDashboardStoreService extends AbstractStore<EmployeeDashboardViewModel[]> {
  /**
   * Instantiates the EmployeeApiService
   * @param {EmployeeApiService} employeeApiService - Service containing employee API related functions
   * @param {Router} router - A service that provides navigation among views and URL manipulation capabilities.
   */
  constructor(private readonly employeeApiService: EmployeeApiService, private readonly router: Router) {
    super();
  }

  /**
   * Builds the employee dashbord store: retrieves and connects the employees accreditation list and the employees list
   * @return {any} combined observable of the employees accreditation list and the emplyoees list
   */
  protected buildStore(): any {
    const employeeAccreditationList$ = this.getEmployeesAccreditation();
    const employeesList$ = this.getEmployees();

    return combineLatest([employeesList$, employeeAccreditationList$]).pipe(
      map(([employees, accreditation]) =>
        employees.map((employee) => ({
          ...employee,
          status: accreditation.find((aEmployee) => aEmployee.referenceNumber === employee.referenceNumber)?.status
            ? accreditation.find((aEmployee) => aEmployee.referenceNumber === employee.referenceNumber)?.status
            : '',
          accreditationId: accreditation.find((aEmployee) => aEmployee.referenceNumber === employee.referenceNumber)
            ?.accreditationId
            ? accreditation.find((aEmployee) => aEmployee.referenceNumber === employee.referenceNumber)?.accreditationId
            : '',
        }))
      )
    );
  }

  /**
   * Retrieves the employees
   * @return {Observable<EmployeeDashboardViewModel[]>} Observable of the employees in the dashboard view mode
   */
  public getEmployees(): Observable<EmployeeDashboardViewModel[]> {
    return this.employeeApiService
      .getEmployees()
      .pipe(map((apiModels: EmployeeApiModel[]) => this.mapEmployeeApiModelToViewModel(apiModels)));
  }

  /**
   * Downloads the email with the invitation for the given employee ID
   * @param {string} id - employee ID
   * @return {Observable<any>} invitation email
   */
  public downloadEmail(id: string): Observable<any> {
    return this.employeeApiService.getInvitationEmail(id);
  }

  /**
   * Attempts to delete the employee with the given employee ID
   * @param {string} id - employee ID
   */
  public deleteEmployee(id: string): void {
    this.employeeApiService.deleteEmployee(id).subscribe(
      (response: EmployeeAccreditationApiModel) => {
        this.storeSubject.next(this.update(response));
      },
      (error: any) => {
        console.error('Error', error);
      }
    );
  }

  private getEmployeesAccreditation(): Observable<EmployeeDashboardViewModel[]> {
    return this.employeeApiService
      .getEmployeesAccredtitation()
      .pipe(
        map((apiModels: EmployeeAccreditationApiModel[]) => this.mapEmployeeAccreditationApiModelToViewModel(apiModels))
      );
  }

  private mapEmployeeApiModelToViewModel(apiModel: EmployeeApiModel[]): EmployeeDashboardViewModel[] {
    return apiModel.map((employee) => ({
      accreditationId: '',
      employeeId: employee.employeeId,
      referenceNumber: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      creationDate: '',
      location: `${employee.companyCity}, ${employee.companyStreet}`,
      status: '',
    }));
  }

  private mapEmployeeAccreditationApiModelToViewModel(
    apiModel: EmployeeAccreditationApiModel[]
  ): EmployeeDashboardViewModel[] {
    return apiModel.map((accreditation) => ({
      accreditationId: accreditation.id,
      employeeId: accreditation.employee.employeeId,
      referenceNumber: accreditation.employee.id,
      firstName: accreditation.employee.firstName,
      lastName: accreditation.employee.lastName,
      creationDate: '',
      location: `${accreditation.employee.companyCity}, ${accreditation.employee.companyStreet}`,
      status: accreditation.status,
    }));
  }

  private update(data: EmployeeAccreditationApiModel): EmployeeDashboardViewModel[] {
    const dataD: EmployeeDashboardViewModel = {
      accreditationId: data.id,
      employeeId: data.employee?.employeeId,
      referenceNumber: data.employee.id,
      firstName: data.employee.firstName,
      lastName: data.employee.lastName,
      creationDate: '',
      location: `${data.employee.companyCity}, ${data.employee.companyStreet}`,
      status: data.status,
    };
    this.storeSubject.value.push(dataD);

    return this.storeSubject.value;
  }
}
