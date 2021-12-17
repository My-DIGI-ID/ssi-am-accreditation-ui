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

import { Component, OnInit } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import AuthenticationService from '../authentication/authentication.service';

/**
 * Class representing the HeaderComponent
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export default class HeaderComponent implements OnInit {
  loggedInUser: string | undefined;

  /**
   * Instantiates the HeaderComponent
   * @param {AuthenticationService} authenticationService - service containing functions related to authentication
   */
  constructor(private authenticationService: AuthenticationService) {}

  /**
   * Initialising function that checks if the user is logged in and loads profile after
   * @param {AuthenticationService} authenticationService - employee store service - contains employee related functions
   */
  public ngOnInit(): void {
    this.authenticationService
      .isLoggedIn()
      .then((userLoggedIn: boolean) => {
        if (userLoggedIn) {
          this.loadUserProfile();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * Logs the user out
   */
  public logout(): void {
    this.authenticationService.logout();
  }

  private loadUserProfile(): void {
    this.authenticationService.loadUserProfile().then((userProfile: KeycloakProfile) => {
      if (userProfile) {
        this.loggedInUser = this.authenticationService.getUserName();
      }
    });
  }
}
