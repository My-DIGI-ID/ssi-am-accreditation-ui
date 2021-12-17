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
import { map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import GuestFormModel from '../../models/guest-form.model';
import GuestAccreditionModel from '../../models/guest-accreditation.model';
import { ApplicationURL } from '../../../../shared/utilities/application-url';
import AbstractStore from '../../../../shared/abstractions/store.abstract';
import GuestDashboardViewModel from '../../models/guest-dashboard-view.model';
import GuestApiModel from '../../models/guest-api.model';
import GuestApiService from '../api/guest-api.service';

/**
 * Class representing the GuestDashboardStoreService
 * @extends AbstractStore
 */
@Injectable({
  providedIn: 'root',
})
export default class GuestDashboardStoreService extends AbstractStore<GuestDashboardViewModel[]> {
  /**
   * Instantiates the GuestDashboardStoreService
   * @param {GuestApiService} guestApiService - A service providing functions related to the guest api
   * @param {Router} router - A service that provides navigation among views and URL manipulation capabilities.
   */
  public constructor(private readonly guestApiService: GuestApiService, private router: Router) {
    super();
  }

  /**
   * Builds the store, retrieves the list of guests and the list of guest accreditations and returns an
   * Observable of a guest with mapped status and accreditation ID
   * @return {Observable<GuestDashboardViewModel[]>} - guest
   */
  protected buildStore(): Observable<GuestDashboardViewModel[]> {
    const guestAccreditationList$ = this.getGuestsAccreditation();
    const guestsList$ = this.getGuests();

    return combineLatest([guestsList$, guestAccreditationList$]).pipe(
      map(([guests, accreditation]) =>
        guests.map((guest) => ({
          ...guest,
          status: this.statusMapping(guest, accreditation),
          accreditationId: accreditation.find((a) => a.guestId === guest.id)?.accreditationId
            ? accreditation.find((a) => a.guestId === guest.id)?.accreditationId
            : '',
        }))
      )
    );
  }

  /**
   * Maps the status to any of the following values: 'PENDING', 'CANCELLED', 'ACCEPTED', 'CHECK_IN' or
   * 'CHECK_OUT' and returns it
   * @param {GuestDashboardViewModel} guest - guest dashboard view DTO
   * @param {any} accreditation - accreditation object
   * @return {string} status
   */
  private statusMapping(guest: GuestDashboardViewModel, accreditation: any): string {
    let status = accreditation.find((a) => a.guestId === guest.id)?.status
      ? accreditation.find((a) => a.guestId === guest.id)?.status
      : '';

    if (
      status === 'OPEN' ||
      status === 'PENDING' ||
      status === 'BASIS_ID_VERIFICATION_PENDING' ||
      status === 'BASIS_ID_VALID'
    ) {
      status = 'PENDING';
    } else if (status === 'CANCELLED' || status === 'BASIS_ID_INVALID' || status === 'REVOKED') {
      status = 'CANCELLED';
    } else if (status === 'ACCEPTED') {
      status = 'ACCEPTED';
    } else if (status === 'CHECK_IN') {
      status = 'CHECK_IN';
    } else if (status === 'CHECK_OUT') {
      status = 'CHECK_OUT';
    }

    return status;
  }

  /**
   * Retrieves an Observable of an array guests in dashboard view format
   * @return {Observable<GuestDashboardViewModel[]>} guests
   */
  public getGuests(): Observable<GuestDashboardViewModel[]> {
    return this.guestApiService
      .getGuests()
      .pipe(map((apiModels: GuestApiModel[]) => this.mapGuestApiModelToViewModel(apiModels)));
  }

  /**
   * Retrieves an Observable of the guest form based on the guest's party ID
   * @param {string} guestId - guest party ID
   * @return {Observable<GuestFormModel>} guest form
   */
  public getGuestByPartyId(guestId: string): Observable<GuestFormModel> {
    return this.guestApiService
      .getGuestByPartyId(guestId)
      .pipe(map((apiModels: any) => this.mapGuestApiModelToFormModel(apiModels)));
  }

  /**
   * Attempts to update guest based the on provided guest object. Then navigates to the guest/creation-status page
   * @param {GuestApiModel} guest - guest
   */
  public editGuest(guest: GuestApiModel): void {
    this.guestApiService.editGuest(guest).subscribe(
      (response) => {
        this.storeSubject.next(this.update(response));
        this.handleOnResponse(true, ApplicationURL.GuestCreationStatus);
      },
      (error: any) => {
        console.error('Error', error);
        this.handleOnResponse(false, ApplicationURL.GuestCreationStatus);
      }
    );
  }

  /**
   * Attempts to add a guest based on the provided guest object. Then navigates to the guest/creation-status page
   * @param {GuestApiModel} guest - guest
   */
  public addGuest(guest: GuestApiModel): void {
    this.guestApiService.saveGuest(guest).subscribe(
      (response) => {
        this.storeSubject.next(this.update(response));
        this.handleOnResponse(true, ApplicationURL.GuestCreationStatus);
      },
      (error: any) => {
        console.error('Error', error);
        this.handleOnResponse(false, ApplicationURL.GuestCreationStatus);
      }
    );
  }

  /**
   * Attempts to delete a guest based on the provided accreditation ID. Then navigates to the guest/dashboard page
   * @param {GuestApiModel} guest - guest
   */
  public deleteGuestByAccreditationId(accreditationId: string): void {
    this.guestApiService.deleteGuestByAccreditationId(accreditationId).subscribe(
      (response) => {
        this.storeSubject.next(this.update(response));
        this.handleOnResponse(true, ApplicationURL.GuestDashboard);
      },
      (error: any) => {
        console.error('Error', error);
        this.handleOnResponse(false, ApplicationURL.GuestDashboard);
      }
    );
  }

  /**
   * Attempts to delete a guest based on the provided party ID. Then navigates to the guest/dashboard page
   * @param {GuestApiModel} guest - guest
   */
  public deleteGuestByPartyId(partyId: string): void {
    this.guestApiService.deleteGuestByPartyId(partyId).subscribe(
      (response) => {
        this.storeSubject.next(this.update(response));
        this.handleOnResponse(true, ApplicationURL.GuestDashboard);
      },
      (error: any) => {
        console.error('Error', error);
        this.handleOnResponse(false, ApplicationURL.GuestDashboard);
      }
    );
  }

  /**
   * Retrieves the invitation e-mail for the provided guest ID
   * @param {string} id - guest ID
   * @return {Observable<any>} invitation e-mail
   */
  public downloadEmail(id: string): Observable<any> {
    return this.guestApiService.getInvitationEmail(id);
  }

  private getGuestsAccreditation(): Observable<any> {
    return this.guestApiService
      .getGuestsAccredititation()
      .pipe(map((apiModels: GuestAccreditionModel[]) => this.mapGuestsAccreditationApiModelToViewModel(apiModels)));
  }

  private update(data: GuestApiModel): GuestDashboardViewModel[] {
    if (data) {
      const dataT: GuestDashboardViewModel = this.mapGuestApiModelToViewModel([data])[0];
      this.storeSubject.value.push(dataT);
    }

    return this.storeSubject.value;
  }

  private mapGuestsAccreditationApiModelToViewModel(apiModel: GuestAccreditionModel[]): any {
    return apiModel.map((guestAccreditation) => ({
      guestId: guestAccreditation.guest.id,
      accreditationId: guestAccreditation.id,
      status: guestAccreditation.status,
    }));
  }

  private mapGuestApiModelToFormModel(apiModel: GuestApiModel): GuestFormModel {
    return {
      firstName: apiModel.firstName,
      lastName: apiModel.lastName,
      companyName: apiModel.companyName,
      title: apiModel.title,
      primaryPhone: apiModel.primaryPhoneNumber,
      secondaryPhone: apiModel.secondaryPhoneNumber,
      email: apiModel.email,
      typeOfVisit: apiModel.typeOfVisit,
      location: apiModel.location,
      validFromDate: apiModel.validFrom,
      validFromTime: apiModel.validFrom,
      validUntilDate: apiModel.validUntil,
      validUntilTime: apiModel.validUntil,
      issuedBy: apiModel.createdBy,
    };
  }

  private mapGuestApiModelToViewModel(apiModel: GuestApiModel[]): GuestDashboardViewModel[] {
    return apiModel.map((guest) => ({
      id: guest.id,
      firstName: guest.firstName,
      lastName: guest.lastName,
      arriving: this.getTimeFromIsoString(guest.validFrom),
      leaving: this.getTimeFromIsoString(guest.validUntil),
      email: guest.email,
      location: guest.location,
      status: '',
    }));
  }

  private getTimeFromIsoString(isoString: string): string {
    const inputDateTime = new Date(isoString);
    const today = new Date();
    let date = inputDateTime.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    if (
      inputDateTime.getFullYear() === today.getFullYear() &&
      inputDateTime.getMonth() === today.getMonth() &&
      inputDateTime.getDate() === today.getDate()
    ) {
      date = 'Heute';
    }
    const min = (inputDateTime.getMinutes() < 10 ? '0' : '') + inputDateTime.getMinutes();
    const hour = (inputDateTime.getHours() < 10 ? '0' : '') + inputDateTime.getHours();

    return `${date}, ${hour}:${min}`;
  }

  private handleOnResponse(status: boolean, url: string): void {
    this.router.navigate([url], {
      state: {
        success: status,
      },
    });
  }
}
