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
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export default class AuthenticationGuard extends KeycloakAuthGuard {
  constructor(protected router: Router, protected keycloakAngular: KeycloakService) {
    super(router, keycloakAngular);
  }

  isAccessAllowed(route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      if (!this.authenticated) {
        this.keycloakAngular.login();
        resolve(false);
        return;
      }

      // In case we will use the roles set in Keycloak
      const requiredRoles = route.data.roles;
      let accessGranted: boolean = false;
      // allow acces when no additional roles are required to enter
      if (!requiredRoles || requiredRoles.length === 0) {
        accessGranted = true;
      } else {
        // eslint-disable-next-line no-restricted-syntax
        for (const requiredRole of requiredRoles) {
          if (this.roles.indexOf(requiredRole) > -1) {
            accessGranted = true;
            break;
          }
        }
      }

      resolve(accessGranted);
    });
  }
}
