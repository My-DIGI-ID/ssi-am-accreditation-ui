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

import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

/**
 * Class representing the AuthenticationService
 */
@Injectable({
  providedIn: 'root',
})
export default class AuthenticationService {
  /**
   * Instantiates the AuthenticationService
   * @param {KeycloakService} keycloakService - keycloak service
   */
  constructor(private keycloakService: KeycloakService) {}

  /**
   * Checks if user is logged in, using the keycloak service
   * @return {Promise<boolean>} logged status
   */
  public isLoggedIn(): Promise<boolean> {
    return this.keycloakService.isLoggedIn();
  }

  /**
   * Calls the keycloak service to log in
   */
  public login(): void {
    this.keycloakService.login();
  }

  /**
   * Calls the keycloak service to load the user's profile
   * @return {Promise<KeycloakProfile>} profile
   */
  public loadUserProfile(): Promise<KeycloakProfile> {
    return this.keycloakService.loadUserProfile();
  }

  /**
   * Calls the keycloak service to log out
   */
  public logout(): void {
    this.keycloakService.logout();
  }

  /**
   * Calls the keycloak service to retrieve the user roles
   * @return {Array<string>} user roles
   */
  public getRoles(): Array<string> {
    return this.keycloakService.getUserRoles();
  }

  /**
   * Calls the keycloak service to retrieve the username
   * @return {string} username
   */
  public getUserName(): string {
    return this.keycloakService.getUsername();
  }

  /**
   * Calls the keycloak service to retrieve the token
   * @return {Promise<string>} token
   */
  public getToken(): Promise<string> {
    return this.keycloakService.getToken();
  }
}
