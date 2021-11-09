/* eslint-disable class-methods-use-this */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import GuestAccreditionModel from '../../models/guest-accreditation.model';
import GuestExtendedApiModel from '../../models/guest-extended-api.model';
import ConfigInitService from '../../../../init/config-init.service';
import GuestApiModel from '../../models/guest-api.model';

@Injectable({
  providedIn: 'root',
})
export default class GuestApiService {
  public httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private readonly http: HttpClient, private readonly configServie: ConfigInitService) {}

  public getGuests(): Observable<GuestApiModel[]> {
    return this.http.get<GuestApiModel[]>(
      `${this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/party/guest/`
    );
  }

  public getGuestById(accreditationId: string): Observable<GuestAccreditionModel> {
    return this.http.get<GuestAccreditionModel>(
      `${
        this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/private/${accreditationId}`
    );
  }

  public saveGuest(guest: GuestApiModel): Observable<GuestApiModel> {
    return this.http.post<GuestApiModel>(
      `${this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/party/guest/`,
      guest,
      this.httpHeader
    );
  }

  public updateExtendedGuest(guest: GuestExtendedApiModel, accreditationId: string): Observable<GuestAccreditionModel> {
    return this.http.patch<GuestAccreditionModel>(
      `${
        this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/append/guest-proprietary-information/${accreditationId}`,
      guest,
      this.httpHeader
    );
  }

  public getInvitationEmail(guestId: string): Observable<any> {
    return this.http.post<any>(
      `${
        this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/initiate/invitation-email/${guestId}`,
      {}
    );
  }

  public deleteGuest(guestId: string): Observable<any> {
    return Observable.create((observer) => {
      // if (this.error) {
      //   observer.error(new Error(..))
      // } else {
      //   observer.next(this.data);
      // }
      observer.complete(guestId);
    });
    // return this.http.post<any>(
    //   `${this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/deleteurl/${guestId}`,
    //   {}
    // );
  }
}
