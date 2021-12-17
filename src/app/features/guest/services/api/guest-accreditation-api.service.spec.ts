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

import { TestBed } from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import GuestAccreditationApiService from './guest-accreditation-api.service';
import ConfigInitService from '../../../../init/config-init.service';
import Spy = jasmine.Spy;

describe('GuestAccreditationApiService', () => {
  let guestAccreditationApiService: GuestAccreditationApiService;
  let configServiceMockSpy: Spy;
  const ConfigServiceMock = {
    getConfigStatic: (): Observable<any> => of({ a: '1' }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: ConfigInitService,
          useValue: ConfigServiceMock,
        },
      ],
    });

    guestAccreditationApiService = TestBed.inject(GuestAccreditationApiService);
    configServiceMockSpy = spyOn(ConfigServiceMock, 'getConfigStatic').and.callThrough();
  });

  it('instance should be successfully created', () => {
    expect(guestAccreditationApiService).toBeTruthy();
  });
  it('if I call the getBasisIdCheckCompletionStatus function, configService should be also called', () => {
    guestAccreditationApiService.getBasisIdCheckCompletionStatus('id-123');

    expect(configServiceMockSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the getQRCode function, configService should be also called', () => {
    guestAccreditationApiService.getQRCode('id-123');

    expect(configServiceMockSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the offerCredential function, configService should be also called', () => {
    guestAccreditationApiService.offerCredential('id-123');

    expect(configServiceMockSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the getAccreditationCompletionStatus function, configService should be also called', () => {
    guestAccreditationApiService.getAccreditationCompletionStatus('id-123');

    expect(configServiceMockSpy).toHaveBeenCalledTimes(1);
  });
});
