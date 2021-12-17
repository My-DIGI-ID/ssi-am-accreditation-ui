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

/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GuestCreationStatusComponent } from './guest-creation-status.component';
import Spy = jasmine.Spy;

describe('GuestCreationStatusComponent', () => {
  let component: GuestCreationStatusComponent;
  let fixture: ComponentFixture<GuestCreationStatusComponent>;
  let router: Router;
  let routerSpy: Spy;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestCreationStatusComponent],
      imports: [
        MatIconModule,
        RouterTestingModule.withRoutes([{ path: 'creation-status', component: GuestCreationStatusComponent }]),
        TranslateModule.forRoot(),
      ],
      providers: [TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    translateService = TestBed.inject(TranslateService);
    router = TestBed.inject(Router);
    router.initialNavigation();
    fixture = TestBed.createComponent(GuestCreationStatusComponent);
    component = fixture.componentInstance;
    routerSpy = spyOn(component['router'], 'navigateByUrl');

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it(`if I call the 'goToAddGuest' method, I should be taken to the 'guest/add' page`, () => {
    component.goToAddGuest();

    expect(routerSpy).toHaveBeenCalledOnceWith('guest/add');
  });

  it(`if I call the 'goToDashboard' method, I should be taken to the 'guest/dashboard' page`, () => {
    component.goToDashboard();

    expect(routerSpy).toHaveBeenCalledOnceWith('guest/dashboard');
  });

  describe('if the add guest component creation was successful', () => {
    beforeEach(() => {
      router.getCurrentNavigation = jasmine.createSpy().and.returnValue({
        extras: {
          state: {
            success: true,
          },
        },
      });
      fixture = TestBed.createComponent(GuestCreationStatusComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('the initializer function should be called in the constructor', () => {
      expect(router.getCurrentNavigation).toHaveBeenCalled();
    });

    it('navigation state extras success should be true', () => {
      expect(component.navigationState.extras.state.success).toEqual(true);
    });

    it('header text should get the success header text', () => {
      const successHeaderText = translateService.instant('guest.guest-creation-status-component.success.header');

      expect(component.getStatusTitle()).toEqual(successHeaderText);
    });

    it('description text should get the success text', () => {
      const successText = translateService.instant('guest.guest-creation-status-component.success.text');

      expect(component.getStatusDescription()).toEqual(successText);
    });
  });

  describe('if the add guest was not successful', () => {
    beforeEach(() => {
      router.getCurrentNavigation = jasmine.createSpy().and.returnValue({
        extras: {
          state: {
            success: false,
          },
        },
      });
      fixture = TestBed.createComponent(GuestCreationStatusComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('the initializer function should be called in the constructor', () => {
      expect(router.getCurrentNavigation).toHaveBeenCalled();
    });

    it('navigation state extras success should be false', () => {
      expect(component.navigationState.extras.state.success).toEqual(false);
    });

    it('header text should get the error header text', () => {
      const errorTitle = translateService.instant('guest.guest-creation-status-component.error.header');

      expect(component.getStatusTitle()).toEqual(errorTitle);
    });

    it('description text should get the error text', () => {
      const errorDescription = translateService.instant('guest.guest-creation-status-component.error.text');

      expect(component.getStatusDescription()).toEqual(errorDescription);
    });
  });
});
