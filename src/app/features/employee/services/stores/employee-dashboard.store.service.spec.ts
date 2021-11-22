/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
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
}

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
    spyOn<any>(service, 'getEmployeesAccreditation').and.returnValue(
      of([
        {
          referenceNumber: '1',
          firstName: 'Su',
          lastName: 'Ming',
          creationDate: '',
          location: '',
          status: 'valid',
        },
      ])
    );

    spyOn(service, 'getEmployees').and.returnValue(
      of([
        {
          accreditationId: '123',
          referenceNumber: '1',
          firstName: 'Mario',
          lastName: 'Sunn',
          creationDate: '',
          location: '',
          status: 'valid',
        },
      ])
    );

    service['buildStore']().subscribe((subscription: any) => {
      expect(subscription[0].status).toEqual('valid');
    });
  });

  it('if the buildStore function is called and the employee and accreditation have no reference number match, the result status should be an empty string', () => {
    spyOn<any>(service, 'getEmployeesAccreditation').and.returnValue(
      of([
        {
          referenceNumber: '1',
          firstName: 'Su',
          lastName: 'Ming',
          creationDate: '',
          location: '',
          status: 'valid',
        },
      ])
    );

    spyOn(service, 'getEmployees').and.returnValue(
      of([
        {
          accreditationId: '123',
          referenceNumber: '2',
          firstName: 'Mario',
          lastName: 'Sunn',
          creationDate: '',
          location: '',
          status: 'valid',
        },
      ])
    );

    service['buildStore']().subscribe((subscription: any) => {
      expect(subscription[0].status).toEqual('');
    });
  });

  it('if the buildStore function is called, the getEmployeesAccreditation function should be also called', () => {
    spyOn<any>(service, 'getEmployeesAccreditation').and.returnValue(
      of([
        {
          referenceNumber: '1',
          firstName: 'Su',
          lastName: 'Ming',
          creationDate: '',
          location: '',
          status: 'valid',
        },
      ])
    );

    spyOn(service, 'getEmployees').and.returnValue(
      of([
        {
          accreditationId: '123',
          referenceNumber: '1',
          firstName: 'Mario',
          lastName: 'Sunn',
          creationDate: '',
          location: '',
          status: 'valid',
        },
      ])
    );

    service['buildStore']().subscribe((subscription: any) => {
      expect(subscription[0].status).toEqual('valid');
    });
  });

  it('if the downloadEmail function is called, the employeeApiService should also call the getInvitationEmail function', () => {
    service.downloadEmail('123');

    expect(employeeApiService.getInvitationEmail).toHaveBeenCalledWith('123');
  });

  it('if the mapEmployeeApiModelToViewModel function is called, it should have an EmployeeDashboardViewModel[] output', () => {
    const result = service['mapEmployeeApiModelToViewModel']([new EmployeeApiModel()]);

    const expectedResult = {
      accreditationId: '',
      employeeId: undefined,
      referenceNumber: undefined,
      firstName: undefined,
      lastName: undefined,
      creationDate: '',
      location: 'undefined, undefined',
      status: '',
    };

    expect(result).toEqual([Object(expectedResult)]);
  });

  it('if the mapEmployeeAccreditationApiModelToViewModel function is called, it should return an EmployeeDashboardViewModel', () => {
    const output = service['mapEmployeeAccreditationApiModelToViewModel']([
      {
        id: '1234',
        employee: {
          id: '2345',
          firstName: 'Dennis',
          lastName: 'Lars',
          primaryPhoneNumber: '0049167874213',
          employeeState: 'active',
          employeeId: '123',
        },
        status: 'valid',
        invitationUrl: 'myUrl',
        invitationEmail: 'dennis.lars@ibm.com',
        invitationQrCode: 'qrCode',
      },
    ]);

    const expectedOutput = [
      {
        accreditationId: '1234',
        employeeId: '123',
        referenceNumber: '2345',
        firstName: 'Dennis',
        lastName: 'Lars',
        creationDate: '',
        location: '',
        status: 'valid',
      },
    ];

    expect(output).toEqual(expectedOutput);
  });
});
