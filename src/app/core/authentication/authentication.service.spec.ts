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

/* eslint-disable @typescript-eslint/no-empty-function */
import { TestBed } from '@angular/core/testing';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import AuthenticationService from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  const keycloakServiceMock = {
    isLoggedIn: (): Promise<boolean> => new Promise((resolve) => resolve(true)),
    login: (): void => {},
    loadUserProfile: (): Promise<KeycloakProfile> =>
      new Promise((resolve) => {
        resolve({});
      }),
    logout: (): void => {},
    getUserRoles: (): Array<string> => ['123'],
    getUsername: (): string => 'mock user name',
    getToken: (): Promise<string> => new Promise((resolve) => resolve('mock')),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: KeycloakService, useValue: keycloakServiceMock }],
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('instance should be successfully created', () => {
    expect(service).toBeTruthy();
  });

  it('if I call the isLoggedIn function the keycloak service is also called', async () => {
    const keycloakServiceIsLoggedInSpy = spyOn(keycloakServiceMock, 'isLoggedIn').and.callThrough();
    service.isLoggedIn();

    expect(keycloakServiceIsLoggedInSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the login function the keycloak service is also called', async () => {
    const keycloakServiceLoginSpy = spyOn(keycloakServiceMock, 'login').and.callThrough();
    service.login();

    expect(keycloakServiceLoginSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the loadUserProfile function the keycloak service is also called', async () => {
    const keycloakServiceLoadUserProfileSpy = spyOn(keycloakServiceMock, 'loadUserProfile').and.callThrough();
    service.loadUserProfile();

    expect(keycloakServiceLoadUserProfileSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the logout function the keycloak service is also called', async () => {
    const keycloakServiceLogoutSpy = spyOn(keycloakServiceMock, 'logout').and.callThrough();
    service.logout();

    expect(keycloakServiceLogoutSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the getRoles function the keycloak service is also called', async () => {
    const keycloakServiceGetUserRolesSpy = spyOn(keycloakServiceMock, 'getUserRoles').and.callThrough();
    service.getRoles();

    expect(keycloakServiceGetUserRolesSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the getUserName function the keycloak service is also called', async () => {
    const keycloakServiceGetUsernameSpy = spyOn(keycloakServiceMock, 'getUsername').and.callThrough();
    service.getUserName();

    expect(keycloakServiceGetUsernameSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the getToken function the keycloak service is also called', async () => {
    const keycloakServiceGetTokenSpy = spyOn(keycloakServiceMock, 'getToken').and.callThrough();
    service.getToken();

    expect(keycloakServiceGetTokenSpy).toHaveBeenCalledTimes(1);
  });
});
