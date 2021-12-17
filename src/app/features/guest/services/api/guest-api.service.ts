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

/* eslint-disable class-methods-use-this */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import GuestAccreditionModel from '../../models/guest-accreditation.model';
import GuestExtendedApiModel from '../../models/guest-extended-api.model';
import ConfigInitService from '../../../../init/config-init.service';
import GuestApiModel from '../../models/guest-api.model';

/**
 * Class representing the GuestApiService
 */
@Injectable({
  providedIn: 'root',
})
export default class GuestApiService {
  public httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  /**
   * Instantiates the GuestApiService
   * @param {HttpClient} http - Service that performs http requests.
   * @param {ConfigInitService} configService - Service that retrieves the application configuration.
   */
  public constructor(private readonly http: HttpClient, private readonly configService: ConfigInitService) {}

  /**
   * HTTP GET request that retrieves an Observable of an array of guests
   * @return {Observable<GuestApiModel[]>} guests
   */
  public getGuests(): Observable<GuestApiModel[]> {
    return this.http.get<GuestApiModel[]>(
      `${this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/party/guest/`
    );
  }

  /**
   * HTTP GET request that retrieves an Observable of a guest based on the accreditation ID
   * @param {string} accreditationId - the accreditation ID
   * @return {Observable<GuestAccreditionModel>} guest
   */
  public getGuestByAccreditationId(accreditationId: string): Observable<GuestAccreditionModel> {
    return this.http.get<any>(
      `${
        this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/private/${accreditationId}`
    );
  }

  /**
   * HTTP GET request that retrieves an Observable of a guest based on the party ID
   * @param {string} guestId - the guest's party ID
   * @return {Observable<GuestAccreditionModel>} guest
   */
  public getGuestByPartyId(guestId: string): Observable<GuestAccreditionModel> {
    return this.http.get<GuestAccreditionModel>(
      `${this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/party/guest/${guestId}`
    );
  }

  /**
   * HTTP GET request that retrieves an Observable of an array of guest accreditations
   * @return {Observable<GuestAccreditionModel[]>} guests accreditation
   */
  public getGuestsAccredititation(): Observable<GuestAccreditionModel[]> {
    return this.http.get<GuestAccreditionModel[]>(
      `${this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/accreditation/guest/`
    );
  }

  /**
   * HTTP PUT request that updates the guest based on the given guest object and returns an Observable of the updated guest
   * @param {GuestApiModel} guest - guest
   * @return {Observable<GuestApiModel>} guest
   */
  public editGuest(guest: GuestApiModel): Observable<GuestApiModel> {
    return this.http.put<GuestApiModel>(
      `${this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/party/guest/${guest.id}`,
      guest,
      this.httpHeader
    );
  }

  /**
   * HTTP POST request that creates a guest based on the given guest object and returns an Observable of the created guest
   * @param {GuestApiModel} guest - guest
   * @return {Observable<GuestApiModel>} guest
   */
  public saveGuest(guest: GuestApiModel): Observable<GuestApiModel> {
    return this.http.post<GuestApiModel>(
      `${this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/party/guest/`,
      guest,
      this.httpHeader
    );
  }

  /**
   * HTTP PATCH request that updates a guest with extra properties, based on the given guest object and accreditation ID
   * and returns an Observable of the guest accreditation
   * @param {GuestExtendedApiModel} guest - extended guest
   * @param {string} accreditationId - accreditation ID
   * @return {Observable<GuestAccreditionModel>} guest
   */
  public updateExtendedGuest(guest: GuestExtendedApiModel, accreditationId: string): Observable<GuestAccreditionModel> {
    return this.http.patch<GuestAccreditionModel>(
      `${
        this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/append/guest-proprietary-information/${accreditationId}`,
      guest,
      this.httpHeader
    );
  }

  /**
   * HTTP POST request that sends a blob and receives the invitation e-mail for the guest with the provided guest ID
   * @param {string} guestId - guest ID
   * @return {Observable<any>} invitation e-mail
   */
  public getInvitationEmail(guestId: string): Observable<any> {
    return this.http.post<Blob>(
      `${
        this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/initiate/invitation-email/${guestId}`,
      null,
      {
        responseType: <any>'text',
        observe: 'response',
      }
    );
  }

  /**
   * HTTP PATCH request that deletes a guest based on accreditation ID
   * @param {string} accreditationId - accreditation ID
   * @return {Observable<any>} new value
   */
  public deleteGuestByAccreditationId(accreditationId: string): Observable<any> {
    return this.http.patch<any>(
      `${
        this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/revoke/${accreditationId}`,
      {}
    );
  }

  /**
   * HTTP DELETE request that deletes a guest based on party ID
   * @param {string} accreditationId - accreditation ID
   * @return {Observable<any>} delete result
   */
  public deleteGuestByPartyId(partyId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.configService.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/party/guest/${partyId}`,
      {}
    );
  }
}
