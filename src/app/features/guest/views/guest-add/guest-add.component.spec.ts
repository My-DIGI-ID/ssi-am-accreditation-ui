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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import GuestDashboardStoreService from '../../services/stores/guest-dashboard-store.service';
import { GuestFormComponent } from '../../forms/guest-form/guest-form.component';
import GuestAddComponent from './guest-add.component';

class GuestDashboardStoreServiceMock {
  init = jasmine.createSpy();

  addGuest = jasmine.createSpy().and.returnValue(of({}));
}

describe('GuestAddComponent', () => {
  let component: GuestAddComponent;
  let fixture: ComponentFixture<GuestAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestAddComponent, GuestFormComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        TranslateModule.forRoot(),
      ],
      providers: [TranslateService, { provide: GuestDashboardStoreService, useClass: GuestDashboardStoreServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestAddComponent);
    component = fixture.componentInstance;

    TestBed.inject(GuestDashboardStoreService);
    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it(`if I call the 'go to dashboard' method, I should be taken to the add dashboard page`, () => {
    const routerSpy = spyOn(component['router'], 'navigateByUrl');
    component.goToDashboard();

    expect(routerSpy).toHaveBeenCalledOnceWith('guest');
  });

  it('if I call the submitAddGuest function, with an invalid guest form, should not trigger createGuestApiDTO', () => {
    const createGuestApiDTOSpy = spyOn<any>(component, 'createGuestApiDTO').and.callThrough();

    component.submitAddGuest();

    expect(createGuestApiDTOSpy).toHaveBeenCalledTimes(0);
  });

  it('if I call the submitAddGuest function, with a valid guest form, the createGuestApiDTO should also be called', () => {
    const createGuestApiDTOSpy = spyOn<any>(component, 'createGuestApiDTO').and.callThrough();
    const guestFormComponent = fixture.debugElement.query(By.directive(GuestFormComponent)).componentInstance;
    guestFormComponent.guestForm = guestFormComponent.createGuestForm();
    guestFormComponent.guestForm.controls.firstName.setValue('Adrian');
    guestFormComponent.guestForm.controls.lastName.setValue('Schultz');
    guestFormComponent.guestForm.controls.companyName.setValue('IBM');
    guestFormComponent.guestForm.controls.title.setValue('General manager');
    guestFormComponent.guestForm.controls.primaryPhone.setValue('0123');
    guestFormComponent.guestForm.controls.email.setValue('adrian.schultz@ibm.com');
    guestFormComponent.guestForm.controls.typeOfVisit.setValue('business');
    guestFormComponent.guestForm.controls.location.setValue('Budapest');
    guestFormComponent.guestForm.controls.validFromDate.setValue(
      new Date('Wed Dec 12 2022 01:00:00 GMT+0100 (Central European Standard Time)')
    );
    guestFormComponent.guestForm.controls.validFromTime.setValue('09:00:00');
    guestFormComponent.guestForm.controls.validUntilDate.setValue(new Date('12/12/2022'));
    guestFormComponent.guestForm.controls.validUntilTime.setValue('10:00:00');
    guestFormComponent.guestForm.controls.issuedBy.setValue('');

    component.submitAddGuest();

    expect(createGuestApiDTOSpy).toHaveBeenCalledTimes(1);
  });

  it('if the function extractDate is called with an invalid date, it should return an empty string', () => {
    const extractedDate = component['extractDate']('abcd', '');

    expect(extractedDate).toEqual('');
  });
});
