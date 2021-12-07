/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import GuestFormModel from '../../models/guest-form.model';
import GuestApiModel from '../../models/guest-api.model';
import GuestDashboardViewModel from '../../models/guest-dashboard-view.model';
import GuestDashboardStoreService from './guest-dashboard-store.service';
import GuestApiService from '../api/guest-api.service';

const giziGuestApiM: GuestApiModel = {
  id: 'guest-id',
  title: 'Ms',
  firstName: 'Gizi',
  lastName: 'Doe',
  email: 'gizi@email.com',
  primaryPhoneNumber: '012345',
  secondaryPhoneNumber: '000123',
  companyName: 'ibm',
  typeOfVisit: 'Presentation',
  location: 'Budapest',
  validFrom: '2021-11-26T11:44:08.330Z',
  validUntil: '2021-11-26T11:44:08.330Z',
  createdBy: 'employee-1',
  createdAt: '2021-11-26T11:44:08.330Z',
  issuedBy: 'employee-2',
};

const giziGuestDashboardViewM: GuestDashboardViewModel = {
  id: 'guest-id-1',
  firstName: 'Gizi',
  lastName: 'Doe',
  arriving: '',
  leaving: '',
  email: 'gizi@email.com',
  location: 'Budapest',
  status: '',
  accreditationId: '',
};

const giziGuestFormM: GuestFormModel = {
  firstName: 'Gizi',
  lastName: 'Doe',
  companyName: 'ibm',
  title: 'Ms',
  primaryPhone: '012345',
  secondaryPhone: '000123',
  email: 'gizi@email.com',
  typeOfVisit: 'Presentation',
  location: 'Budapest',
  validFromDate: '2021-11-26T11:44:08.330Z',
  validFromTime: '2021-11-26T11:44:08.330Z',
  validUntilDate: '2021-11-26T11:44:08.330Z',
  validUntilTime: '2021-11-26T11:44:08.330Z',
  issuedBy: 'employee-1',
};

const accreditationOpen = [
  {
    accreditationId: '',
    guestId: 'guest-id-1',
    status: 'OPEN',
  },
];

const accreditationBasisIdInvalid = [
  {
    accreditationId: '',
    guestId: 'guest-id-1',
    status: 'BASIS_ID_INVALID',
  },
];

const accreditationAccepted = [
  {
    accreditationId: '',
    guestId: 'guest-id-1',
    status: 'ACCEPTED',
  },
];

const accreditationCheckIn = [
  {
    accreditationId: '',
    guestId: 'guest-id-1',
    status: 'CHECK_IN',
  },
];

const accreditationCheckOut = [
  {
    accreditationId: '',
    guestId: 'guest-id-1',
    status: 'CHECK_OUT',
  },
];

describe('GuestDashboardStoreService', () => {
  let service: GuestDashboardStoreService;
  let guestApiService: GuestApiService;
  const errorResponse = new HttpErrorResponse({
    error: { code: `some code`, message: `some message.` },
    status: 400,
    statusText: 'Bad Request',
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuestDashboardStoreService],
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(GuestDashboardStoreService);
    guestApiService = TestBed.inject(GuestApiService);
    TestBed.inject(Router);
    service['storeSubject'] = new BehaviorSubject([new GuestDashboardViewModel()]);

    spyOn(service['router'], 'navigateByUrl');
    spyOn(console, 'error').and.returnValue();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('instance should be successfully created', () => {
    expect(service).toBeTruthy();
  });

  it('if the buildStore function is called, the guestApiService should also call the getGuests function', () => {
    const guestApiServiceGetGuestsAccredititation = spyOn<any>(
      guestApiService,
      'getGuestsAccredititation'
    ).and.returnValue(of({}));
    const guestApiServiceGetGuestSpy = spyOn<any>(guestApiService, 'getGuests').and.returnValue(of({}));
    service['buildStore']();

    expect(guestApiServiceGetGuestsAccredititation).toHaveBeenCalled();
    expect(guestApiServiceGetGuestSpy).toHaveBeenCalled();
  });

  it('if the getGuests function is called, the guestApiService should also call the getGuests function', () => {
    const guestApiServiceGetGuestSpy = spyOn<any>(guestApiService, 'getGuests').and.returnValue(of({}));
    service.getGuests();

    expect(guestApiServiceGetGuestSpy).toHaveBeenCalled();
  });

  it('if the addGuest function is called, the guestApiService should also call the saveGuests function', () => {
    const guestApiServiceSaveGuestSpy = spyOn<any>(guestApiService, 'saveGuest').and.returnValue(
      of((response: any) => {
        response.next();
      })
    );
    service.addGuest(giziGuestApiM);

    expect(guestApiServiceSaveGuestSpy).toHaveBeenCalled();
  });

  it('if the deleteGuestByPartyId function is called, the guestApiService should also call the deleteGuestByPartyId function', () => {
    const guestApiServiceDeleteGuestSpy = spyOn<any>(guestApiService, 'deleteGuestByPartyId').and.returnValue(of({}));
    service.deleteGuestByPartyId('123');

    expect(guestApiServiceDeleteGuestSpy).toHaveBeenCalled();
  });

  it('if the deleteGuestByAccreditationId function is called, the guestApiService should also call the deleteGuestByAccreditationId function', () => {
    const guestApiServiceDeleteGuestSpy = spyOn<any>(guestApiService, 'deleteGuestByAccreditationId').and.returnValue(
      of({})
    );
    service.deleteGuestByAccreditationId('123');

    expect(guestApiServiceDeleteGuestSpy).toHaveBeenCalled();
  });

  it('if the deleteGuestByAccreditationId function is called, I should be taken on the dashboard with success true', () => {
    const routerNavigateSpy = spyOn(service['router'], 'navigate');
    spyOn<any>(guestApiService, 'deleteGuestByAccreditationId').and.returnValue(of({}));
    service.deleteGuestByAccreditationId('123');

    expect(routerNavigateSpy).toHaveBeenCalledWith(['guest/dashboard'], { state: { success: true } });
  });

  it('if the deleteGuestByAccreditationId function is called, and return with an error, I should be taken on the dashboard with success false', () => {
    const rSpy = spyOn(service['router'], 'navigate');
    spyOn<any>(guestApiService, 'deleteGuestByAccreditationId').and.returnValue(throwError(errorResponse));
    service.deleteGuestByAccreditationId('123');

    expect(rSpy).toHaveBeenCalledWith(['guest/dashboard'], { state: { success: false } });
  });

  it('if the downloadEmail function is called, the guestApiService should also call the getInvitationEmail function', () => {
    const guestApiServiceGetInvitationEmailSpy = spyOn<any>(guestApiService, 'getInvitationEmail').and.returnValue(
      of('id')
    );
    service.downloadEmail('123');

    expect(guestApiServiceGetInvitationEmailSpy).toHaveBeenCalledWith('123');
  });

  it('if the editGuest function is called, the guestApiService should also call the editGuest function', () => {
    const guestApiServiceEditGuestSpy = spyOn<any>(guestApiService, 'editGuest').and.returnValue(
      of((response: any) => {
        response.next();
      })
    );
    service.editGuest(giziGuestApiM);

    expect(guestApiServiceEditGuestSpy).toHaveBeenCalled();
  });

  it('if the editGuest function is called, and return with an error, I should be taken in creation-status page with success: false', () => {
    const routerNavigateSpy = spyOn(service['router'], 'navigate');
    spyOn<any>(guestApiService, 'editGuest').and.returnValue(throwError(errorResponse));
    service.editGuest(giziGuestApiM);

    expect(routerNavigateSpy).toHaveBeenCalledWith(['guest/creation-status'], { state: { success: false } });
  });

  it('if the update function is called, the mapGuestApiModelToViewModel function should also be called', () => {
    const mapGuestApiModelToViewModelSpy = spyOn<any>(service, 'mapGuestApiModelToViewModel').and.callThrough();
    service['update'](giziGuestApiM);

    expect(mapGuestApiModelToViewModelSpy).toHaveBeenCalled();
  });

  it(`if the getTimeFromIsoString function is called with today's date as parameter, it should return Heute`, () => {
    const today = new Date();
    const processedTime = service['getTimeFromIsoString'](today.toString());

    expect(processedTime.substring(0, 5)).toEqual('Heute');
  });

  it(`if the getTimeFromIsoString function is not called with today's date as parameter, it should not return 'Heute'`, () => {
    const today = '194-11-12';
    const processedTime = service['getTimeFromIsoString'](today.toString());

    expect(processedTime.substring(0, 5)).not.toEqual('Heute');
  });

  it('if I call the connect function, it should return the store', () => {
    const connectOutput = service.connect();

    expect(connectOutput).toEqual(service['store']);
  });

  it('if I call the init function, it should call the buildStore function', () => {
    const buildStoreSpy = spyOn<any>(service, 'buildStore').and.returnValue(of(''));
    service.init();

    expect(buildStoreSpy).toHaveBeenCalled();
  });

  it('if I call the reset function, it should set the value of storeSubject to null', () => {
    service.reset();

    expect(service['storeSubject'].getValue()).toBeNull();
  });

  it('if I call the publish function should set the value of storeSubject to the store copy used as parameter', () => {
    service['publish']([new GuestDashboardViewModel()]);

    expect(service['storeSubject'].getValue()).toEqual([new GuestDashboardViewModel()]);
  });

  it('if I call the statusMapping on an empty accredtitation, it should return with empty status', () => {
    const accreditation = [];
    const status = service['statusMapping'](giziGuestDashboardViewM, accreditation);

    expect(status).toEqual('');
  });

  it('if I call the statusMapping on an OPEN accredtitation, it should return with PENDING status', () => {
    const status = service['statusMapping'](giziGuestDashboardViewM, accreditationOpen);

    expect(status).toEqual('PENDING');
  });

  it('if I call the statusMapping on an BASIS_ID_INVALID accredtitation, it should return with CANCELLED status', () => {
    const status = service['statusMapping'](giziGuestDashboardViewM, accreditationBasisIdInvalid);

    expect(status).toEqual('CANCELLED');
  });

  it('if I call the statusMapping on an ACCEPTED accredtitation, it should return with ACCEPTED status', () => {
    const status = service['statusMapping'](giziGuestDashboardViewM, accreditationAccepted);

    expect(status).toEqual('ACCEPTED');
  });

  it('if I call the statusMapping on an CHECK_IN accredtitation, it should return with CHECK_IN status', () => {
    const status = service['statusMapping'](giziGuestDashboardViewM, accreditationCheckIn);

    expect(status).toEqual('CHECK_IN');
  });

  it('if I call the statusMapping on an CHECK_OUT accredtitation, it should return with CHECK_OUT status', () => {
    const status = service['statusMapping'](giziGuestDashboardViewM, accreditationCheckOut);

    expect(status).toEqual('CHECK_OUT');
  });

  it('if I call the mapGuestApiModelToFormModel with guestApiModel, it should return with an guestFormModel', () => {
    const accredtiation = service['mapGuestApiModelToFormModel'](giziGuestApiM);

    expect(accredtiation).toEqual(giziGuestFormM);
  });
});
