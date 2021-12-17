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

/* eslint-disable class-methods-use-this */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ConfigInitService from '../../../../init/config-init.service';
import EmployeeApiModel from '../../models/employee-api.model';

/**
 * Class representing the EmployeeApiService
 */
@Injectable({
  providedIn: 'root',
})
export default class EmployeeApiService {
  public httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  /**
   * Instantiates the EmployeeApiService
   * @param {HttpClient} http - Service that performs http requests.
   * @param {ConfigInitService} configService - Service that retrieves the application configuration.
   */
  constructor(private http: HttpClient, private readonly configService: ConfigInitService) {}

  /**
   * HTTP GET request that retrieves the employee with the given ID
   * @param {string} id - Service that performs http requests.
   * @return {Observable<EmployeeApiModel>} Observable of employee
   */
  public getEmployee(id: string): Observable<EmployeeApiModel> {
    return this.http.get<EmployeeApiModel>(
      `${this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/party/employee/${id}`
    );
  }

  /**
   * HTTP GET request that retrieves all the employees
   * @return {Observable<EmployeeApiModel[]>} Observable of employees
   */
  public getEmployees(): Observable<EmployeeApiModel[]> {
    return this.http.get<EmployeeApiModel[]>(
      `${this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/party/employee/`
    );
  }

  /**
   * HTTP POST request that saves an employee and returns the new data
   * @param {EmployeeApiModel} employeeApiModel - employee to save
   * @return {Observable<EmployeeApiModel>} Observable of saved employee
   */
  public saveEmployee(employeeApiModel: EmployeeApiModel): Observable<EmployeeApiModel> {
    return this.http.post<EmployeeApiModel>(
      `${this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/party/employee/`,
      employeeApiModel,
      this.httpHeader
    );
  }

  /**
   * HTTP POST request that saves an employee CSV and returns the response of the post request
   * @param {FormData} formData - employee form
   * @return {Observable<any>} response
   */
  public saveEmployeeCSV(formData: FormData): Observable<any> {
    return this.http.post<FormData>(
      `${this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/party/employee/csv`,
      formData,
      {
        headers: this.httpHeader.headers.delete('Content-Type'),
        observe: 'events',
        reportProgress: true,
      }
    );
  }

  /**
   * HTTP POST request that posts a blob and returns an Observable of an invitation email
   * @param {string} employeeId - employee ID
   * @return {Observable<any>} response
   */
  public getInvitationEmail(employeeId: string): Observable<any> {
    return this.http.post<Blob>(
      `${
        this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/employee/initiate/invitation-email/${employeeId}`,
      null,
      {
        responseType: <any>'text',
        observe: 'response',
      }
    );
  }

  /**
   * HTTP GET request that posts a blob and returns an Observable of an invitation email
   * @param {string} employeeId - employee ID
   * @return {Observable<any>} response
   */
  public getEmployeesAccredtitation(): Observable<any> {
    return this.http.get<EmployeeApiModel>(
      `${this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/accreditation/employee`
    );
  }

  /**
   * HTTP PATCH request that deletes the employee with the given employee ID
   * @param {string} employeeId - employee ID
   * @return {Observable<any>} response
   */
  public deleteEmployee(employeeId: string): Observable<any> {
    return this.http.patch(
      `${
        this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/employee/revoke/${employeeId}`,
      {}
    );
  }
}
