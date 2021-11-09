import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Observable } from 'rxjs';
import GuestApiService from './guest-api.service';
import ConfigInitService from '../../../../init/config-init.service';
import Spy = jasmine.Spy;

describe('GuestApiService', () => {
  let guestApiService: GuestApiService;
  let configServieMockSpy: Spy;
  const configServieMock = {
    getConfigStatic: (): Observable<any> => of({ a: '1' }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ConfigInitService,
          useValue: configServieMock,
        },
      ],
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    guestApiService = TestBed.inject(GuestApiService);
    configServieMockSpy = spyOn(configServieMock, 'getConfigStatic').and.callThrough();
  });

  it('instance should be successfully created', () => {
    expect(guestApiService).toBeTruthy();
  });

  it('if I call the getGuests function, ConfigInitService should be also called', () => {
    guestApiService.getGuests();

    expect(configServieMockSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the getGuestById function, ConfigInitService should be also called', () => {
    guestApiService.getGuestById('id');

    expect(configServieMockSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the saveGuest function, ConfigInitService should be also called', () => {
    guestApiService.saveGuest({
      id: '',
      title: '',
      firstName: '',
      lastName: '',
      email: '',
      companyName: '',
      typeOfVisit: '',
      location: '',
      validFrom: '',
      validUntil: '',
    });

    expect(configServieMockSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the updateExtendedGuest function, ConfigInitService should be also called', () => {
    guestApiService.updateExtendedGuest(
      {
        companyStreet: '',
        companyCity: '',
        companyPostCode: '',
        acceptedDocument: '',
      },
      'id'
    );

    expect(configServieMockSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the getInvitationEmail function, ConfigInitService should be also called', () => {
    guestApiService.getInvitationEmail('id');

    expect(configServieMockSpy).toHaveBeenCalledTimes(1);
  });
});
