/* eslint-disable class-methods-use-this */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ConfigInitService from '../../../../init/config-init.service';
import EmployeeApiModel from '../../models/employee-api.model';

@Injectable({
  providedIn: 'root',
})
export default class EmployeeApiService {
  public httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private readonly configServie: ConfigInitService) {}

  public getEmployee(id: string): Observable<EmployeeApiModel> {
    return this.http.get<EmployeeApiModel>(
      `${this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/party/employee/${id}`
    );
  }

  public getEmployees(): Observable<EmployeeApiModel[]> {
    return this.http.get<EmployeeApiModel[]>(
      `${this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/party/employee/`
    );
  }

  public saveEmployee(employeeApiModel: EmployeeApiModel): Observable<EmployeeApiModel> {
    return this.http.post<EmployeeApiModel>(
      `${this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/party/employee/`,
      employeeApiModel,
      this.httpHeader
    );
  }

  public saveEmployeeCSV(formdata: FormData): Observable<any> {
    return this.http.post<FormData>(
      `${this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/party/employee/csv`,
      formdata,
      {
        headers: this.httpHeader.headers.delete('Content-Type'),
        observe: 'events',
        reportProgress: true,
      }
    );
  }

  public getInvitationEmail(employeeId: string): Observable<any> {
    return this.http.post<Blob>(
      `${
        this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/employee/initiate/invitation-email/${employeeId}`,
      null,
      {
        responseType: <any>'text',
        observe: 'response',
      }
    );
  }

  public getEmployeesAccredtitation(): Observable<any> {
    return this.http.get<EmployeeApiModel>(
      `${this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/accreditation/employee`
    );
  }

  public deleteEmployee(employeeId: string): Observable<any> {
    return this.http.patch(
      `${
        this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/employee/revoke/${employeeId}`,
      {}
    );
  }
}
