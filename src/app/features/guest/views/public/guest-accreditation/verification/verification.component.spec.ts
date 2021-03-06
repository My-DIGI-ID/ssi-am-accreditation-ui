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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { VerificationComponent } from './verification.component';
import GuestStoreService from '../../../../services/stores/guest-store.service';

class StoreMock {
  getQRCode = jasmine.createSpy().and.returnValue(of('some string'));

  pollBasisIdProcessing = jasmine.createSpy().and.returnValue(of('some string'));
}
describe('VerificationComponent', () => {
  let component: VerificationComponent;
  let fixture: ComponentFixture<VerificationComponent>;
  let store: GuestStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerificationComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MatCheckboxModule, TranslateModule.forRoot()],
      providers: [
        TranslateService,
        {
          provide: GuestStoreService,
          useClass: StoreMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(GuestStoreService);
    fixture = TestBed.createComponent(VerificationComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('if the onGDPRChecked set to true, isGDPRChecked variable should be true', () => {
    component.onGDPRChecked(true);
    fixture.detectChanges();

    expect(component.isGDPRChecked).toEqual(true);
  });

  it('if the onGDPRChecked set to true, getQRCode should be called', () => {
    component.onGDPRChecked(true);
    fixture.detectChanges();

    // eslint-disable-next-line dot-notation
    expect(store['getQRCode']).toHaveBeenCalled();
  });

  it('if the onGDPRChecked set to false, isGDPRChecked variable should be false', () => {
    component.onGDPRChecked(false);
    fixture.detectChanges();

    expect(component.isGDPRChecked).toEqual(false);
  });

  it('if I call the initializeBasisIdVerification, pollBasisIdProcessing should also be called', () => {
    // eslint-disable-next-line dot-notation
    component['accreditationId'] = '123';
    // eslint-disable-next-line dot-notation
    component['initializeBasisIdVerification']();
    fixture.detectChanges();

    // eslint-disable-next-line dot-notation
    expect(store['pollBasisIdProcessing']).toHaveBeenCalled();
  });
});
