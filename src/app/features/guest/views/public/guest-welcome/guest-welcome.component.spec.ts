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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import GuestWelcomeComponent from './guest-welcome.component';
import Spy = jasmine.Spy;

describe('GuestWelcomeComponent', () => {
  let component: GuestWelcomeComponent;
  let fixture: ComponentFixture<GuestWelcomeComponent>;
  let routerSpy: Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestWelcomeComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatIconModule,
        MatCheckboxModule,
        TranslateModule.forRoot(),
      ],
      providers: [TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestWelcomeComponent);
    component = fixture.componentInstance;
    routerSpy = spyOn(component['router'], 'navigate');

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it(`if I call the 'go to accreditation' function, I should be taken to the accreditation page`, () => {
    component.goToAccreditation();

    expect(routerSpy).toHaveBeenCalledOnceWith(['guest/accreditation', undefined]);
  });

  it(`if I call the 'changeQRCodeVisibility' function with true, isConfirmCheckboxChecked should be true`, () => {
    component.changeQRCodeVisibility(true);

    expect(component.isConfirmCheckboxChecked).toEqual(true);
  });

  it(`if I call the 'changeQRCodeVisibility' function with false, isConfirmCheckboxChecked should be false`, () => {
    component.changeQRCodeVisibility(false);

    expect(component.isConfirmCheckboxChecked).toEqual(false);
  });

  it(`if I call the 'nextStep' function, isFirstStepActive should be false`, () => {
    component.nextStep();

    expect(component.isFirstStepActive).toEqual(false);
  });
});
