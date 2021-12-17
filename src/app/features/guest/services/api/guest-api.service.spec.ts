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
import GuestApiService from './guest-api.service';
import ConfigInitService from '../../../../init/config-init.service';

class ConfigServiceMock {
  init = jasmine.createSpy();

  getConfigStatic = jasmine.createSpy().and.returnValue({ ACCREDITATION_CONTROLLER_BASE_URL: 'myUrl' });
}

describe('GuestApiService', () => {
  let guestApiService: GuestApiService;
  let httpGetSpy: jasmine.Spy;
  let httpPostSpy: jasmine.Spy;
  let httpPutSpy: jasmine.Spy;
  let httpPatchSpy: jasmine.Spy;
  let httpDeleteSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ConfigInitService, useClass: ConfigServiceMock }],
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    guestApiService = TestBed.inject(GuestApiService);
    TestBed.inject(ConfigInitService);
    httpGetSpy = spyOn(guestApiService['http'], 'get').and.callThrough();
    httpPostSpy = spyOn(guestApiService['http'], 'post').and.callThrough();
    httpPutSpy = spyOn(guestApiService['http'], 'put').and.callThrough();
    httpPatchSpy = spyOn(guestApiService['http'], 'patch').and.callThrough();
    httpDeleteSpy = spyOn(guestApiService['http'], 'delete').and.callThrough();
  });

  it('instance should be successfully created', () => {
    expect(guestApiService).toBeTruthy();
  });

  it('if I call the getGuests function, the http get function should also be called', () => {
    guestApiService.getGuests();

    expect(httpGetSpy).toHaveBeenCalledWith('myUrl/api/v2/party/guest/');
  });

  it('if I call the getGuestByAccreditationId function, the http get function should also be called', () => {
    guestApiService.getGuestByAccreditationId('id');

    expect(httpGetSpy).toHaveBeenCalledWith('myUrl/api/v2/accreditation/guest/private/id');
  });

  it('if I call the saveGuest function, the http post function should also be called', () => {
    const guest = {
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
    };
    guestApiService.saveGuest(guest);

    expect(httpPostSpy).toHaveBeenCalledWith('myUrl/api/v2/party/guest/', guest, guestApiService.httpHeader);
  });

  it('if I call the updateExtendedGuest function,  the http patch function should also be called', () => {
    const extendedGuest = {
      companyStreet: '',
      companyCity: '',
      companyPostCode: '',
      acceptedDocument: '',
    };
    guestApiService.updateExtendedGuest(extendedGuest, 'id');

    expect(httpPatchSpy).toHaveBeenCalledWith(
      'myUrl/api/v2/accreditation/guest/append/guest-proprietary-information/id',
      extendedGuest,
      guestApiService.httpHeader
    );
  });

  it('if I call the getInvitationEmail function, the http post function should also be called', () => {
    guestApiService.getInvitationEmail('id');

    expect(httpPostSpy).toHaveBeenCalledWith('myUrl/api/v2/accreditation/guest/initiate/invitation-email/id', null, {
      responseType: 'text',
      observe: 'response',
    });
  });

  it('if I call the getGuestByAccreditationId function, the http get function should also be called', () => {
    guestApiService.getGuestByAccreditationId('123');

    expect(httpGetSpy).toHaveBeenCalledWith('myUrl/api/v2/accreditation/guest/private/123');
  });

  it('if I call the getGuestByPartyId function, the http get function should also be called', () => {
    guestApiService.getGuestByPartyId('123');

    expect(httpGetSpy).toHaveBeenCalledWith('myUrl/api/v2/party/guest/123');
  });

  it('if I call the editGuest function,  the http put function should also be called', () => {
    const guest = {
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
    };
    guestApiService.editGuest(guest);

    expect(httpPutSpy).toHaveBeenCalledWith('myUrl/api/v2/party/guest/', guest, guestApiService.httpHeader);
  });

  it('if I call the deleteGuestByAccreditationId function, the http patch function should also be called', () => {
    guestApiService.deleteGuestByAccreditationId('123');

    expect(httpPatchSpy).toHaveBeenCalledWith('myUrl/api/v2/accreditation/guest/revoke/123', {});
  });

  it('if I call the deleteGuestByPartyId function, the http patch function should also be called', () => {
    guestApiService.deleteGuestByPartyId('123');

    expect(httpDeleteSpy).toHaveBeenCalledWith('myUrl/api/party/guest/123', {});
  });

  it('if I call the deleteGuestByAccreditationId function with empty string, the http patch function should not be called', () => {
    guestApiService.deleteGuestByAccreditationId('');

    expect(httpPatchSpy).not.toHaveBeenCalledWith('myUrl/api/v2/accreditation/guest/revoke/123', {});
  });

  it('if I call the getGuestsAccredititation function, the http get function should also be called', () => {
    guestApiService.getGuestsAccredititation();

    expect(httpGetSpy).toHaveBeenCalledWith('myUrl/api/v2/accreditation/guest/');
  });
});
