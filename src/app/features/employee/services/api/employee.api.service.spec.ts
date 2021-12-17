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

/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import ConfigInitService from '../../../../init/config-init.service';
import EmployeeApiModel from '../../models/employee-api.model';
import EmployeeApiService from './employee.api.service';

class ConfigServiceMock {
  init = jasmine.createSpy();

  getConfigStatic = jasmine.createSpy().and.returnValue({ ACCREDITATION_CONTROLLER_BASE_URL: 'myUrl' });
}

describe('EmployeeApiService', () => {
  let service: EmployeeApiService;
  let httpGetSpy: jasmine.Spy;
  let httpPostSpy: jasmine.Spy;
  let httpPatchSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeApiService, { provide: ConfigInitService, useClass: ConfigServiceMock }],
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(EmployeeApiService);
    TestBed.inject(ConfigInitService);
    httpGetSpy = spyOn(service['http'], 'get').and.callThrough();
    httpPostSpy = spyOn(service['http'], 'post').and.callThrough();
    httpPatchSpy = spyOn(service['http'], 'patch').and.callThrough();
  });

  it('instance should be successfully created', () => {
    expect(service).toBeTruthy();
  });

  it('if getEmployee function is called, the http get function should also be called', () => {
    service.getEmployee('123');

    expect(httpGetSpy).toHaveBeenCalledWith('myUrl/api/v2/party/employee/123');
  });

  it('if getEmployees function is called, the http get function should also be called', () => {
    service.getEmployees();

    expect(httpGetSpy).toHaveBeenCalledWith('myUrl/api/v2/party/employee/');
  });

  it('if saveEmployee function is called, the http post function should also be called', () => {
    service.saveEmployee(new EmployeeApiModel());

    expect(httpPostSpy).toHaveBeenCalledWith(
      'myUrl/api/v2/party/employee/',
      new EmployeeApiModel(),
      service.httpHeader
    );
  });

  it('if saveEmployeeCSV function is called, the http post function should also be called', () => {
    service.saveEmployeeCSV(new FormData());

    expect(httpPostSpy).toHaveBeenCalledWith('myUrl/api/v2/party/employee/csv', new FormData(), {
      headers: service.httpHeader.headers.delete('Content-Type'),
      observe: 'events',
      reportProgress: true,
    });
  });

  it('if getInvitationEmail function is called, the http post function should also be called', () => {
    service.getInvitationEmail('123');

    expect(httpPostSpy).toHaveBeenCalledWith(
      'myUrl/api/v2/accreditation/employee/initiate/invitation-email/123',
      null,
      { responseType: 'text', observe: 'response' }
    );
  });

  it('if getEmployeesAccredtitation function is called, the http get function should also be called', () => {
    service.getEmployeesAccredtitation();

    expect(httpGetSpy).toHaveBeenCalledWith('myUrl/api/v2/accreditation/employee');
  });

  it('if deleteEmployee function is called, the http patch function should also be called', () => {
    service.deleteEmployee('123');

    expect(httpPatchSpy).toHaveBeenCalledWith('myUrl/api/v2/accreditation/employee/revoke/123', {});
  });
});
