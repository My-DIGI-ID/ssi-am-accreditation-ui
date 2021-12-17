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
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import AbstractStore from '../../../../shared/abstractions/store.abstract';
import GuestAccreditionModel from '../../models/guest-accreditation.model';
import GuestAccreditationQRCodeApiModel from '../../models/guest-accreditation-qr-code-api.model';
import GuestExtendedApiModel from '../../models/guest-extended-api.model';
import GuestViewModel from '../../models/guest-view.model';
import GuestApiModel from '../../models/guest-api.model';
import GuestApiService from '../api/guest-api.service';
import GuestAccreditationApiService from '../api/guest-accreditation-api.service';

/**
 * Class representing the GuestStoreService
 * @extends AbstractStore
 */
@Injectable({
  providedIn: 'root',
})
export default class GuestStoreService extends AbstractStore<GuestViewModel[]> {
  private basisIdIsProcessed: Subject<boolean> = new Subject();

  private credentialsOffered: Subject<boolean> = new Subject();

  public $credentialsOfferedObservable = this.credentialsOffered.asObservable();

  /**
   * Instantiates the GuestStoreService
   * @param {GuestApiService} guestApiService - A service providing functions related to the guest api
   * @param {GuestAccreditationApiService} guestAccreditationApiService - A service providing functions for the guest accreditation
   * @param {Router} router - A service that provides navigation among views and URL manipulation capabilities.
   */
  public constructor(
    private readonly guestApiService: GuestApiService,
    private readonly guestAccreditationApiService: GuestAccreditationApiService,
    private readonly router: Router
  ) {
    super();
  }

  /**
   * Builds the store, retrieves the guests through the guest api service and assigns the guest view model
   * properties to the result before returning it
   * @param {any} args
   * @return {any} - guests
   */
  protected buildStore(..._args: any): any {
    return this.guestApiService
      .getGuests()
      .pipe(map((apiModel: GuestApiModel[]) => apiModel.map((el) => Object.assign(new GuestViewModel(), el))));
  }

  /**
   * Retrieves a guest by accreditation ID
   * @param {string} accreditationId - The guest accreditation ID
   * @return {Observable<GuestAccreditionModel>} - guest
   */
  public getGuestByAccreditationId(accreditationId: string): Observable<GuestAccreditionModel> {
    return this.guestApiService
      .getGuestByAccreditationId(accreditationId)
      .pipe(map((result: GuestAccreditionModel) => result));
  }

  /**
   * Updates a guest, based on its accreditation ID, with extra properties
   * @param {GuestExtendedApiModel} guest - extended guest model
   * @param {string} accreditationId - The guest accreditation ID
   * @return {Observable<any>} - updated extended guest
   */
  public extendGuestData(guest: GuestExtendedApiModel, accreditationId: string): Observable<any> {
    return this.guestApiService.updateExtendedGuest(guest, accreditationId);
  }

  /**
   * Retrieves the QR code for guest with the given accreditation ID
   * @param {string} accreditationId - The guest accreditation ID
   * @return {Observable<string>} - QR code as string (URL)
   */
  public getQRCode(accreditationId: string): Observable<string> {
    return this.guestAccreditationApiService
      .getQRCode(accreditationId)
      .pipe(
        map((qrCodeApiModel: GuestAccreditationQRCodeApiModel) => qrCodeApiModel.connectionQrCode.replace(/\\/g, ''))
      );
  }

  /**
   * Offers credentials based on accreditation ID and listens for acceptance
   * @param {string} accreditationId - The guest accreditation ID
   */
  public offerCredential(accreditationId: string): void {
    this.guestAccreditationApiService.offerCredential(accreditationId).subscribe(() => {
      this.pollCredentialAcceptance(accreditationId).subscribe();
    });
  }

  /**
   * Checks whether the basis id processing for the corresponding accreditation ID was completed
   * for 5 seconds, then returns its status
   * @param {string} accreditationId - The guest accreditation ID
   * @return {Observable<any>} - process completion status
   */
  public pollBasisIdProcessing(accreditationId: string): Observable<any> {
    if (!this.basisIdIsProcessed || this.basisIdIsProcessed.isStopped) {
      this.basisIdIsProcessed = new Subject();
    }

    const statusChangeObservable = new Observable((observer) => {
      const requestInterval = setInterval(() => {
        this.guestAccreditationApiService.getBasisIdCheckCompletionStatus(accreditationId).subscribe(
          (basisIdCheck: any) => {
            if (basisIdCheck.status) {
              observer.next(basisIdCheck);
              observer.complete();
              this.basisIdIsProcessed.next(true);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }, 5000);

      return () => {
        clearInterval(requestInterval);
      };
    });

    return statusChangeObservable.pipe(takeUntil(this.basisIdIsProcessed));
  }

  /**
   * Checks whether the basis id processing for the corresponding accreditation ID was completed
   * for 5 seconds, then returns its status
   * @param {string} accreditationId - The guest accreditation ID
   * @return {Observable<any>} - process completion status
   */
  public pollCredentialAcceptance(accreditationId: string): Observable<any> {
    if (!this.credentialsOffered || this.credentialsOffered.isStopped) {
      this.credentialsOffered = new Subject();
    }

    const statusChangeObservable = new Observable((observer) => {
      const requestInterval = setInterval(() => {
        this.guestAccreditationApiService.getAccreditationCompletionStatus(accreditationId).subscribe(
          (completionStatus: any) => {
            if (JSON.parse(String(completionStatus.status))) {
              observer.next(completionStatus);
              observer.complete();
              this.credentialsOffered.next(true);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }, 5000);

      return () => {
        clearInterval(requestInterval);
      };
    });

    return statusChangeObservable.pipe(takeUntil(this.credentialsOffered));
  }
}
