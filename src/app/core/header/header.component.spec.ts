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

import { MatIconModule } from '@angular/material/icon';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatToolbarHarness } from '@angular/material/toolbar/testing';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import HeaderComponent from './header.component';

let userLoggedIn: boolean = true;
const userProfile: KeycloakProfile = {};

const keycloakServiceMock = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: (): void => {},
  loadUserProfile: (): Promise<KeycloakProfile> =>
    new Promise((resolve) => {
      resolve(userProfile);
    }),
  getUsername: (): string => 'mock keycloak user',
  isLoggedIn: (): Promise<boolean> =>
    new Promise((resolve) => {
      resolve(userLoggedIn);
    }),
};

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [MatToolbarModule, MatIconModule, TranslateModule.forRoot()],
      providers: [{ provide: KeycloakService, useValue: keycloakServiceMock }, TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('should have an instance of mat-toolbar', async () => {
    const toolbar = await loader.getAllHarnesses(MatToolbarHarness);

    expect(toolbar.length).toBe(1);
  });

  it('if I call the logout function the keycloak service is also called', async () => {
    const keycloakServiceLogoutSpy = spyOn(keycloakServiceMock, 'logout').and.callThrough();
    component.logout();

    expect(keycloakServiceLogoutSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the loadUserProfile function the keycloak service is also called', async () => {
    const keycloakServiceLoadUserProfileSpy = spyOn(keycloakServiceMock, 'loadUserProfile').and.callThrough();
    // eslint-disable-next-line dot-notation
    component['loadUserProfile']();

    expect(keycloakServiceLoadUserProfileSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the ngOnInit and the user is not logged in, the keycloak service function loadUserProfile should not be called', async () => {
    userLoggedIn = false;
    const keycloakServiceLoadUserProfileSpy = spyOn(keycloakServiceMock, 'loadUserProfile').and.callThrough();
    component.ngOnInit();

    expect(keycloakServiceLoadUserProfileSpy).toHaveBeenCalledTimes(0);
  });

  it('if I call the ngOnInit and the user profile is not retrieved  is not logged in, the keycloak service function getUsername should not be called', async () => {
    const keycloakServiceLoadUserProfileSpy = spyOn(keycloakServiceMock, 'getUsername').and.callThrough();
    // eslint-disable-next-line dot-notation
    component['loadUserProfile']();

    expect(keycloakServiceLoadUserProfileSpy).toHaveBeenCalledTimes(0);
  });
});
