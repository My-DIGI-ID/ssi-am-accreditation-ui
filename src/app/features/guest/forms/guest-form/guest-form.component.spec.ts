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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import GuestFormModel from '../../models/guest-form.model';
import NgswService from '../../../../shared/services/ngsw.service';
import { GuestFormComponent } from './guest-form.component';

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

describe('GuestFormComponent', () => {
  let component: GuestFormComponent;
  let fixture: ComponentFixture<GuestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestFormComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        TranslateModule.forRoot(),
      ],
      providers: [NgswService, TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it(`if I call the 'submit' function , the 'submitForm' should be emitted`, () => {
    const submitFormSpy = spyOn(component['submitForm'], 'emit');
    component.submit();
    fixture.detectChanges();

    expect(submitFormSpy).toHaveBeenCalledTimes(1);
  });

  it(`if I call the 'populateGuestForm' function , the edit mode should be true`, () => {
    component.populateGuestForm(giziGuestFormM);
    fixture.detectChanges();

    expect(component.editMode).toEqual(true);
  });

  it(`if I call the 'populateGuestForm' function , the firstName should be get the proper value`, () => {
    component.populateGuestForm(giziGuestFormM);
    fixture.detectChanges();

    expect(component.guestForm.controls.firstName.value).toEqual(giziGuestFormM.firstName);
  });

  it('if I call the disableFields function, the company name filed, should be disabled', () => {
    component.disableFields();
    fixture.detectChanges();

    expect(component.guestForm.controls.companyName.disabled).toEqual(true);
  });

  it('if I call the disableFields function, the email field, should be disabled', () => {
    component.disableFields();
    fixture.detectChanges();

    expect(component.guestForm.controls.email.disabled).toEqual(true);
  });

  it('if I call the disableFields function, the issuedBy field, should be disabled', () => {
    component.disableFields();
    fixture.detectChanges();

    expect(component.guestForm.controls.issuedBy.disabled).toEqual(true);
  });

  it('if I call the getTimeFromIsoString with an ISO string, it should return with the time', () => {
    const isoString = '2021-11-26T03:04:08.330Z';
    const time = component['getTimeFromIsoString'](isoString);

    const isoStringDate = new Date(isoString);
    const min = (isoStringDate.getMinutes() < 10 ? '0' : '') + isoStringDate.getMinutes();
    const hour = (isoStringDate.getHours() < 10 ? '0' : '') + isoStringDate.getHours();
    const testTime = `${hour}:${min}`;

    fixture.detectChanges();

    expect(time).toEqual(testTime);
  });
});
