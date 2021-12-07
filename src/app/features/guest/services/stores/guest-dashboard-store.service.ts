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

@Injectable({
  providedIn: 'root',
})
export default class GuestDashboardStoreService extends AbstractStore<GuestDashboardViewModel[]> {
  public constructor(private readonly guestApiService: GuestApiService, private router: Router) {
    super();
  }

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

  public getGuests(): Observable<GuestDashboardViewModel[]> {
    return this.guestApiService
      .getGuests()
      .pipe(map((apiModels: GuestApiModel[]) => this.mapGuestApiModelToViewModel(apiModels)));
  }

  public getGuestByPartId(guestId: string): Observable<GuestFormModel> {
    return this.guestApiService
      .getGuestByPartId(guestId)
      .pipe(map((apiModels: any) => this.mapGuestApiModelToFormModel(apiModels)));
  }

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
