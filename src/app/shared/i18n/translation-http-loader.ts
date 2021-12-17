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

import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import ConfigInitService from '../../init/config-init.service';

/**
 * Class representing the TranslationHttpLoader
 * @extends TranslateLoader
 */
export class TranslationHttpLoader implements TranslateLoader {
  /**
   * Instantiates the TranslationHttpLoader
   * @param {HttpClient} http - Service that performs http requests.
   * @param {ConfigInitService} configService - Service that retrieves the application configuration.
   */
  public constructor(private http: HttpClient, private readonly configService: ConfigInitService) {}

  /**
   * Retrieves translation JSON through an HTTP GET request
   * @param {string} language - the language to translate into
   * @return {Observable<any>} - response that can be the JSON translation file if the call is successful
   */
  public getTranslation(lang: string): Observable<any> {
    return this.http.get<any>(
      `${this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/admin/i18n?languageCode=${lang}`
    );
  }
}
