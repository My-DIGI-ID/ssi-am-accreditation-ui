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
// eslint-disable-next-line max-classes-per-file
import { fakeAsync, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import GuestViewModel from '../../models/guest-view.model';
import GuestExtendedFormModel from '../../models/guest-extended-form.model';
import GuestExtendedApiModel from '../../models/guest-extended-api.model';
import GuestStoreService from './guest-store.service';
import GuestApiService from '../api/guest-api.service';
import GuestAccreditationApiService from '../api/guest-accreditation-api.service';

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

  saveGuest = jasmine.createSpy().and.returnValue(of({}));

  updateExtendedGuest = jasmine.createSpy().and.returnValue(of({}));

  getInvitationEmail = jasmine.createSpy().and.returnValue(of({}));

  deleteGuest = jasmine.createSpy().and.returnValue(of({}));
}

class GuestAccreditationApiServiceMock {
  init = jasmine.createSpy();

  getBasisIdCheckCompletionStatus = jasmine.createSpy().and.returnValue(of({}));

  getQRCode = jasmine.createSpy().and.returnValue(of({ connectionQrCode: 'my\\Qr' }));

  offerCredential = jasmine.createSpy().and.returnValue(of({}));

  getAccreditationCompletionStatus = jasmine.createSpy().and.returnValue(of({}));
}

describe('GuestStoreService', () => {
  let service: GuestStoreService;
  let guestApiService: GuestApiService;
  let guestAccreditationApiService: GuestAccreditationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GuestStoreService,
        {
          provide: GuestApiService,
          useClass: GuestApiServiceMock,
        },
        {
          provide: GuestAccreditationApiService,
          useClass: GuestAccreditationApiServiceMock,
        },
      ],
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(GuestStoreService);
    guestApiService = TestBed.inject(GuestApiService);
    guestAccreditationApiService = TestBed.inject(GuestAccreditationApiService);
  });

  it('instance should be successfully created', () => {
    expect(service).toBeTruthy();
  });

  it('if the buildStore function is called, the guestApiService should also call the getGuests function', () => {
    service['buildStore']();

    expect(guestApiService.getGuests).toHaveBeenCalled();
  });

  it('if the buildStore function is called, the guestApiService should also call the getGuests function', async () => {
    const result = await service['buildStore']().toPromise();
    const processedResult = [
      Object.assign(new GuestViewModel(), {
        id: '123',
        firstName: 'Danny',
        lastName: 'Brown',
        email: 'danny.brown@ibm.com',
        location: 'Amsterdam',
      }),
    ];

    expect(result).toEqual(processedResult);
  });

  it('if the getGuestByAccreditationId function is called, the guestApiService should also call the getGuestByAccreditationId function', () => {
    service.getGuestByAccreditationId('123');

    expect(guestApiService.getGuestByAccreditationId).toHaveBeenCalledWith('123');
  });

  it('if the getGuestByAccreditationId function is called, the guestApiService should also call the getGuestByAccreditationId function', async () => {
    const result = await service.getGuestByAccreditationId('123').toPromise();

    expect(result).toEqual({
      connectionQrCode: 'qr',
      guest: new GuestExtendedFormModel(),
      id: '123',
      invitationEmail: 'george.smith@ibm.com',
      invitationLink: 'link.ibm.com',
      status: 'active',
    });
  });

  it('if the extendGuestData function is called, the guestApiService should also call the updateExtendedGuest function', () => {
    const extendedGuest = new GuestExtendedApiModel();
    service.extendGuestData(extendedGuest, '333');

    expect(guestApiService.updateExtendedGuest).toHaveBeenCalledWith(extendedGuest, '333');
  });

  it('getQRCode function should return the a version of the QR code without backslashes', async () => {
    const result = await service.getQRCode('333').toPromise();

    expect(result).toEqual('myQr');
  });

  it('if the getQRCode function is called, the guestAccreditationApiService should also call the getQRCode function', () => {
    service.getQRCode('333');

    expect(guestAccreditationApiService.getQRCode).toHaveBeenCalledWith('333');
  });

  it('if the offerCredential function is called, the guestAccreditationApiService should also call the offerCredential function', () => {
    service.offerCredential('333');

    expect(guestAccreditationApiService.offerCredential).toHaveBeenCalledWith('333');
  });

  it('if the pollBasisIdProcessing function is called, while basisIdIsProcessed is stopped, it should be reinstantiated', () => {
    service['basisIdIsProcessed'].isStopped = true;

    service.pollBasisIdProcessing('333');

    expect(service['basisIdIsProcessed'].isStopped).toEqual(false);
  });

  it('if the pollBasisIdProcessing function is called, while basisIdIsProcessed is not stopped, it should keep its old value', fakeAsync(async () => {
    service['basisIdIsProcessed'].closed = true;

    service.pollBasisIdProcessing('333');

    expect(service['basisIdIsProcessed'].closed).toEqual(true);
  }));

  it('if the pollCredentialAcceptance function is called, while credentialsOffered is stopped, it should be reinstantiated', () => {
    service['credentialsOffered'].isStopped = true;

    service.pollCredentialAcceptance('333');

    expect(service['credentialsOffered'].isStopped).toEqual(false);
  });

  it('if the pollCredentialAcceptance function is called, while credentialsOffered is not stopped, it should keep its old value', () => {
    service['credentialsOffered'].closed = true;

    service.pollCredentialAcceptance('333');

    expect(service['credentialsOffered'].closed).toEqual(true);
  });
});
