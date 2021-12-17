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
import { of, BehaviorSubject } from 'rxjs';
import EmployeeAccreditationApiModel from '../../models/employee-accreditation-api.model';
import EmployeeDashboardViewModel from '../../models/employee-dashboard-view.model';
import EmployeeApiModel from '../../models/employee-api.model';
import EmployeeDashboardStoreService from './employee-dashboard.store.service';
import EmployeeApiService from '../api/employee.api.service';

class EmployeeApiServiceMock {
  init = jasmine.createSpy();

  getEmployee = jasmine.createSpy().and.returnValue(of(new EmployeeApiModel()));

  getEmployees = jasmine.createSpy().and.returnValue(of([new EmployeeApiModel()]));

  saveEmployee = jasmine.createSpy().and.returnValue(of(new EmployeeApiModel()));

  saveEmployeeCSV = jasmine.createSpy().and.returnValue(of());

  getInvitationEmail = jasmine.createSpy().and.returnValue(of());

  getEmployeesAccredtitation = jasmine.createSpy().and.returnValue(of());

  deleteEmployee = jasmine.createSpy().and.returnValue(of(new EmployeeApiModel()));
}

const joeEmployeeDashboardViewM: EmployeeDashboardViewModel = {
  accreditationId: 'accreditation-id-1',
  referenceNumber: 'ref-num-1',
  employeeId: 'employee-id-1',
  firstName: 'Joe',
  lastName: 'Summer',
  creationDate: '',
  location: 'Budapest, Noord',
  status: 'valid',
};

const joe2EmployeeDashboardViewM: EmployeeDashboardViewModel = {
  accreditationId: '',
  referenceNumber: 'ref-num-1',
  employeeId: 'employee-id-1',
  firstName: 'Joe',
  lastName: 'Summer',
  creationDate: '',
  location: 'Budapest, Noord',
  status: '',
};

const mirandaEmployeeDashboardViewM: EmployeeDashboardViewModel = {
  accreditationId: 'accreditation-id-2',
  referenceNumber: 'ref-num-2',
  employeeId: 'employee-id-2',
  firstName: 'Miranda',
  lastName: 'Winter',
  creationDate: '',
  location: 'Budapest',
  status: 'valid',
};

const joeEmployeeApiM: EmployeeApiModel = {
  id: 'ref-num-1',
  firstName: 'Joe',
  lastName: 'Summer',
  primaryPhoneNumber: '001234',
  secondaryPhoneNumber: '',
  title: 'Mr',
  email: 'joe@email.com',
  employeeState: '',
  position: 'Developer',
  employeeId: 'employee-id-1',
  companyName: 'ibm',
  companyStreet: 'Noord',
  companyPostalCode: '1234',
  companyCity: 'Budapest',
  companyReference: 'company-ref-1',
};

const joeEmployeeAccreditationApiM: EmployeeAccreditationApiModel = {
  id: 'accreditation-id-1',
  employee: {
    id: 'ref-num-1',
    firstName: 'Joe',
    lastName: 'Summer',
    primaryPhoneNumber: '001234',
    secondaryPhoneNumber: '',
    title: 'Mr',
    email: 'joe@email.com',
    employeeState: '',
    position: 'Developer',
    employeeId: 'employee-id-1',
    companyName: 'ibm',
    companyStreet: 'Noord',
    companyPostalCode: '1234',
    companyCity: 'Budapest',
    companyReference: 'company-ref-1',
  },
  status: 'valid',
  invitationUrl: 'myUrl',
  invitationEmail: 'dennis.lars@ibm.com',
  invitationQrCode: 'qrCode',
};

describe('EmployeeDashboardStoreService', () => {
  let service: EmployeeDashboardStoreService;
  let employeeApiService: EmployeeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeDashboardStoreService, { provide: EmployeeApiService, useClass: EmployeeApiServiceMock }],
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(EmployeeDashboardStoreService);
    employeeApiService = TestBed.inject(EmployeeApiService);
    service['storeSubject'] = new BehaviorSubject([new EmployeeDashboardViewModel()]);
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('instance should be successfully created', () => {
    expect(service).toBeTruthy();
  });

  it('if the buildStore function is called, the getEmployeesAccreditation function should be also called', () => {
    const getEmployeesAccreditationSpy = spyOn<any>(service, 'getEmployeesAccreditation').and.callThrough();
    service['buildStore']();

    expect(getEmployeesAccreditationSpy).toHaveBeenCalled();
  });

  it('if the buildStore function is called, the getEmployees function should be also called', () => {
    const getEmployeesSpy = spyOn(service, 'getEmployees').and.callThrough();
    service['buildStore']();

    expect(getEmployeesSpy).toHaveBeenCalled();
  });

  it('if the buildStore function is called and the employee and accreditation have a reference number match and a status, the result status should be the same', () => {
    spyOn<any>(service, 'getEmployeesAccreditation').and.returnValue(of([joeEmployeeDashboardViewM]));
    spyOn(service, 'getEmployees').and.returnValue(of([joeEmployeeDashboardViewM]));

    service['buildStore']().subscribe((subscription: any) => {
      expect(subscription[0].status).toEqual('valid');
    });
  });

  it('if the buildStore function is called and the employee and accreditation have no reference number match, the result status should be an empty string', () => {
    spyOn<any>(service, 'getEmployeesAccreditation').and.returnValue(of([joeEmployeeDashboardViewM]));
    spyOn(service, 'getEmployees').and.returnValue(of([mirandaEmployeeDashboardViewM]));

    service['buildStore']().subscribe((subscription: any) => {
      expect(subscription[0].status).toEqual('');
    });
  });

  it('if the buildStore function is called, the getEmployeesAccreditation function should be also called', () => {
    spyOn<any>(service, 'getEmployeesAccreditation').and.returnValue(of([joeEmployeeDashboardViewM]));
    spyOn(service, 'getEmployees').and.returnValue(of([joeEmployeeDashboardViewM]));

    service['buildStore']().subscribe((subscription: any) => {
      expect(subscription[0].status).toEqual('valid');
    });
  });

  it('if the downloadEmail function is called, the employeeApiService should also call the getInvitationEmail function', () => {
    service.downloadEmail('123');

    expect(employeeApiService.getInvitationEmail).toHaveBeenCalledWith('123');
  });

  it('if the mapEmployeeApiModelToViewModel function is called, it should have an EmployeeDashboardViewModel[] output', () => {
    const result = service['mapEmployeeApiModelToViewModel']([joeEmployeeApiM]);

    expect(result).toEqual([Object(joe2EmployeeDashboardViewM)]);
  });

  it('if the mapEmployeeAccreditationApiModelToViewModel function is called, it should return an EmployeeDashboardViewModel', () => {
    const output = service['mapEmployeeAccreditationApiModelToViewModel']([joeEmployeeAccreditationApiM]);

    expect(output).toEqual([Object(joeEmployeeDashboardViewM)]);
  });

  it('if the deleteEmployee function is called, the employeeApiService should also call the deleteEmployee function', () => {
    spyOn<any>(service, 'update').and.returnValue(of([joeEmployeeDashboardViewM]));
    service.deleteEmployee('accreditation-id-1');

    expect(employeeApiService.deleteEmployee).toHaveBeenCalledWith('accreditation-id-1');
  });
});
