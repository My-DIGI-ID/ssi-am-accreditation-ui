import { TestBed } from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import GuestAccreditationApiService from './guest-accreditation-api.service';
import ConfigInitService from '../../../../init/config-init.service';
import Spy = jasmine.Spy;

describe('GuestAccreditationApiService', () => {
  let guestAccreditationApiService: GuestAccreditationApiService;
  let configServieMockSpy: Spy;
  const ConfigServieMock = {
    getConfigStatic: (): Observable<any> => of({ a: '1' }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: ConfigInitService,
          useValue: ConfigServieMock,
        },
      ],
    });

    guestAccreditationApiService = TestBed.inject(GuestAccreditationApiService);
    configServieMockSpy = spyOn(ConfigServieMock, 'getConfigStatic').and.callThrough();
  });

  it('instance should be successfully created', () => {
    expect(guestAccreditationApiService).toBeTruthy();
  });
  it('if I call the getBasisIdCheckCompletionStatus function, configService should be also called', () => {
    guestAccreditationApiService.getBasisIdCheckCompletionStatus('id-123');

    expect(configServieMockSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the getQRCode function, configService should be also called', () => {
    guestAccreditationApiService.getQRCode('id-123');

    expect(configServieMockSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the offerCredential function, configService should be also called', () => {
    guestAccreditationApiService.offerCredential('id-123');

    expect(configServieMockSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the getAccreditationCompletionStatus function, configService should be also called', () => {
    guestAccreditationApiService.getAccreditationCompletionStatus('id-123');

    expect(configServieMockSpy).toHaveBeenCalledTimes(1);
  });
});
