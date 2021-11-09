/* eslint-disable class-methods-use-this */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
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
    return this.guestApiService
      .getGuests()
      .pipe(map((apiModels: GuestApiModel[]) => this.mapGuestApiModelToViewModel(apiModels)));
  }

  public getGuests(): Observable<GuestDashboardViewModel[]> {
    return this.guestApiService
      .getGuests()
      .pipe(map((apiModels: GuestApiModel[]) => this.mapGuestApiModelToViewModel(apiModels)));
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

  public deleteGuest(guestId: string): void {
    this.guestApiService.deleteGuest(guestId).subscribe(
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

  private update(data: GuestApiModel): GuestDashboardViewModel[] {
    const dataT: GuestDashboardViewModel = this.mapGuestApiModelToViewModel([data])[0];
    this.storeSubject.value.push(dataT);

    return this.storeSubject.value;
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
      status: '', // TODO: WE DONT HAVE STATUS IN BE
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

    return `${date}, ${inputDateTime.getHours()}:${min}`;
  }

  private handleOnResponse(status: boolean, url: string): void {
    this.router.navigate([url], {
      state: {
        success: status,
      },
    });
  }
}
