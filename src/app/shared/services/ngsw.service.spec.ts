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
import { of } from 'rxjs';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import NgswService from './ngsw.service';

describe('NgswService', () => {
  let service: NgswService;
  const updateActivatedEvent = {
    type: 'UPDATE_AVAILABLE',
    current: {
      hash: 'string',
      appData: {},
    },
    available: {
      hash: 'string',
      appData: {},
    },
  };

  const unrecoverableStateEvent = {
    type: 'UNRECOVERABLE_STATE',
    reason: '',
  };

  const swUpdateServiceMock = {
    isEnabled: true,
    available: of(updateActivatedEvent),
    activateUpdate: (): Promise<void> => new Promise((resolve) => resolve),
    activated: of(updateActivatedEvent),
    unrecoverable: of(unrecoverableStateEvent),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ServiceWorkerModule.register('ngsw-worker.js', { enabled: false })],
      providers: [
        NgswService,
        {
          provide: SwUpdate,
          useValue: swUpdateServiceMock,
        },
      ],
    });
    service = TestBed.inject(NgswService);
  });

  it('instance should be successfully created', () => {
    expect(service).toBeTruthy();
  });

  it('if I call the activateUpdate function, swUpdateService should be also called', () => {
    const swUpdateServiceMockSpy = spyOn(swUpdateServiceMock, 'activateUpdate').and.callThrough();
    service.activateUpdate();

    expect(swUpdateServiceMockSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the isEnabled function, it should return with true', () => {
    service.isEnabled();

    expect(service.isEnabled()).toEqual(true);
  });

  it(`if I call the isUpdateAvailable function, the return value should contain the 'type' with its value set to 'UPDATE_AVAILABLE' `, () => {
    service.isUpdateAvailable().subscribe((x) => {
      expect(x.type).toEqual('UPDATE_AVAILABLE');
    });
  });

  it(`if I call the isUpdateActivated function, the return value should contain the 'type' with its value set to 'UPDATE_AVAILABLE' `, () => {
    service.isUpdateActivated().subscribe((x) => {
      expect(x.type).toEqual('UPDATE_AVAILABLE');
    });
  });

  it(`if I call the handleUnrecoverableState function, the return value should contain the 'type' with its value set to 'UNRECOVERABLE_STATE' `, () => {
    service.handleUnrecoverableState().subscribe((x) => {
      expect(x.type).toEqual('UNRECOVERABLE_STATE');
    });
  });
});
