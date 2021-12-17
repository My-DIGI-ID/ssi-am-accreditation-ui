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

import { KeycloakService } from 'keycloak-angular';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import ConfigInitService from '../../init/config-init.service';

export default function keyclockInitializer(keyCloak: KeycloakService, configService: ConfigInitService) {
  return () =>
    configService
      .getConfig()
      .pipe(
        switchMap<any, any>((config) =>
          from(
            keyCloak.init({
              config: {
                url: config.KEYCLOAK_URL,
                realm: config.KEYCLOAK_REALM,
                clientId: config.KEYCLOAK_CLIENT_ID,
              },
              initOptions: {
                // onLoad: 'login-required',
                onLoad: 'check-sso',
                checkLoginIframe: false,
                pkceMethod: 'S256',
              },
              bearerExcludedUrls: [],
            })
          )
        )
      )
      .toPromise();
}
