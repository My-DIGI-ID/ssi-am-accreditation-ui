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
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RouterPath } from './shared/enums/router-path';
import { UserRole } from './shared/enums/user-role';
import AuthenticationService from './core/authentication/authentication.service';

/**
 * Class representing the AppComponent
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export default class AppComponent implements OnInit {
  defaultLang: string = 'de';

  /**
   * Instantiates the AppComponent
   * @param {Router} router - A service that provides navigation among views and URL manipulation capabilities.
   * @param {AuthenticationService} authService - Service that deals with the authentication of the user
   * @param {TranslateService} translateService - The internationalisation service
   */
  public constructor(
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private translateService: TranslateService
  ) {}

  /**
   * Initialisation function that sets the default language to German, checks if the user is logged in,
   * and if he is, it retrieves the user roles and navigates to the right corresponding URL
   */
  public ngOnInit(): void {
    this.translateService.use(this.defaultLang);
    // redirect based upon roles in keycloak
    let userRoles: Array<string>;
    this.authService.isLoggedIn().then((userIsLoggedIn: boolean) => {
      if (userIsLoggedIn) {
        userRoles = this.authService.getRoles();
        let routerPath: RouterPath = RouterPath.GUEST;

        userRoles.some((userRole) => {
          switch (userRole) {
            case UserRole.HR_ADMIN:
              routerPath = RouterPath.EMPLOYEE;
              break;
            default:
              return false;
          }
          return true;
        });
        this.router.navigate([routerPath]).catch((e) => console.debug(e));
      }
    });
  }
}
