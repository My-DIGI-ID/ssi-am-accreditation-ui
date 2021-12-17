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

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ConfigInitService from '../../../../init/config-init.service';

/**
 * Class representing the GuestAccreditationApiService
 */
@Injectable({
  providedIn: 'root',
})
export default class GuestAccreditationApiService {
  public httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  /**
   * Instantiates the GuestAccreditationApiService
   * @param {HttpClient} http - Service that performs http requests.
   * @param {ConfigInitService} configService - Service that retrieves the application configuration.
   */
  constructor(private readonly http: HttpClient, private readonly configService: ConfigInitService) {}

  /**
   * HTTP GET request that retrieves the basis ID check completion status as an Observable, based on accrediation ID
   * @param {string} accreditationId - Accreditation ID
   * @return {Observable<any>} status
   */
  public getBasisIdCheckCompletionStatus(accreditationId: string): Observable<any> {
    // @ToDo: make the endpoint more configurable
    return this.http.get(
      `${
        this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/validate/basis-id-process-completion/${accreditationId}`
    );
  }

  /**
   * HTTP PATCH request that retrieves the QR code an Observable, based on accrediation ID
   * @param {string} accreditationId - Accreditation ID
   * @return {Observable<any>} QR code
   */
  public getQRCode(accreditationId: string): Observable<any> {
    return this.http.patch(
      `${
        this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/proceed/qr-code/${accreditationId}`,
      {}
    );
  }

  /**
   * HTTP PATCH request that offers credentials, based on accrediation ID
   * @param {string} accreditationId - Accreditation ID
   * @return {Observable<any>} credentials offered
   */
  public offerCredential(accreditationId: string): Observable<any> {
    return this.http.patch(
      `${
        this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/offer/${accreditationId}`,
      {}
    );
  }

  /**
   * HTTP GET request that retrieves the accrediation completion status, based on accrediation ID
   * @param {string} accreditationId - Accreditation ID
   * @return {Observable<any>} status
   */
  public getAccreditationCompletionStatus(accreditationId: string): Observable<any> {
    return this.http.get(
      `${
        this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/validate/accreditation-process-completion/${accreditationId}`
    );
  }
}
