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
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Class representing the ConfigInitService
 */
@Injectable({
  providedIn: 'root',
})
export default class ConfigInitService {
  private config: any;

  /**
   * Instantiates the ConfigInitService
   * @param {HttpClient} httpClient - Service that performs http requests.
   */
  constructor(private httpClient: HttpClient) {}

  /**
   * Retrieves the app configuration file through an HTTP GET request
   * @return {Observable<any>} response
   */
  public getConfig(): Observable<any> {
    return this.httpClient
      .get(this.getConfigFile(), {
        observe: 'response',
      })
      .pipe(
        catchError((error) => of(error)),
        mergeMap((response) => {
          if (response && response.body) {
            this.config = response.body;
            return of(this.config);
          }
          return of(null);
        })
      );
  }

  /**
   * Retrieves the app static configuration
   * @return {any} configuration
   */
  public getConfigStatic(): any {
    return this.config;
  }

  // eslint-disable-next-line class-methods-use-this
  private getConfigFile(): string {
    return environment.configFile;
  }
}
