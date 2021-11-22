/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';
import GuestExtendedFormModel from '../../models/guest-extended-form.model';
import GuestApiModel from '../../models/guest-api.model';
import GuestDashboardViewModel from '../../models/guest-dashboard-view.model';
import GuestDashboardStoreService from './guest-dashboard-store.service';
import GuestApiService from '../api/guest-api.service';

class GuestApiServiceMock {
  init = jasmine.createSpy();

  getGuests = jasmine.createSpy().and.returnValue(
    of([
      {
        id: '123',
        firstName: 'Danny',
        lastName: 'Brown',
        email: 'danny.brown@ibm.com',
        location: 'Amsterdam',
      },
    ])
  );

  getGuestByAccreditationId = jasmine.createSpy().and.returnValue(
    of({
      connectionQrCode: 'qr',
      guest: new GuestExtendedFormModel(),
      id: '123',
      invitationEmail: 'george.smith@ibm.com',
      invitationLink: 'link.ibm.com',
      status: 'active',
    })
  );

  saveGuest = jasmine.createSpy().and.returnValue(
    of((response: any) => {
      response.next();
    })
  );

  updateExtendedGuest = jasmine.createSpy().and.returnValue(of({}));

  getInvitationEmail = jasmine.createSpy().and.returnValue(of('id'));

  deleteGuest = jasmine.createSpy().and.returnValue(of(new GuestApiModel()));

  getGuestsAccredititation = jasmine.createSpy().and.returnValue(of({}));
}

describe('GuestDashboardStoreService', () => {
  let service: GuestDashboardStoreService;
  let guestApiService: GuestApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GuestDashboardStoreService,
        {
          provide: GuestApiService,
          useClass: GuestApiServiceMock,
        },
      ],
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(GuestDashboardStoreService);
    guestApiService = TestBed.inject(GuestApiService);
    TestBed.inject(Router);
    spyOn(service['router'], 'navigateByUrl');
    service['storeSubject'] = new BehaviorSubject([new GuestDashboardViewModel()]);
  });

  it('instance should be successfully created', () => {
    expect(service).toBeTruthy();
  });

  it('if the buildStore function is called, the guestApiService should also call the getGuests function', () => {
    service['buildStore']();

    expect(guestApiService.getGuests).toHaveBeenCalled();
  });

  it('if the getGuests function is called, the guestApiService should also call the getGuests function', () => {
    service.getGuests();

    expect(guestApiService.getGuests).toHaveBeenCalled();
  });

  it('if the addGuest function is called, the guestApiService should also call the saveGuests function', () => {
    service.addGuest(new GuestApiModel());

    expect(guestApiService.saveGuest).toHaveBeenCalled();
  });

  it('if the deleteGuest function is called, the guestApiService should also call the deleteGuest function', () => {
    service.deleteGuest('123');

    expect(guestApiService.deleteGuest).toHaveBeenCalledWith('123');
  });

  it('if the downloadEmail function is called, the guestApiService should also call the getInvitationEmail function', () => {
    service.downloadEmail('123');

    expect(guestApiService.getInvitationEmail).toHaveBeenCalledWith('123');
  });

  it('if the update function is called, the mapGuestApiModelToViewModel function should also be called', () => {
    const mapGuestApiModelToViewModelSpy = spyOn<any>(service, 'mapGuestApiModelToViewModel').and.callThrough();
    service['update'](new GuestApiModel());

    expect(mapGuestApiModelToViewModelSpy).toHaveBeenCalled();
  });

  it('if the downloadEmail function is called, the guestApiService should also call the getInvitationEmail function', () => {
    service.downloadEmail('123');

    expect(guestApiService.getInvitationEmail).toHaveBeenCalledWith('123');
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
});
