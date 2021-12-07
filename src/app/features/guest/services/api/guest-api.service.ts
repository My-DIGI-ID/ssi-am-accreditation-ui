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

  public constructor(private readonly http: HttpClient, private readonly configServie: ConfigInitService) {}

  public getGuests(): Observable<GuestApiModel[]> {
    return this.http.get<GuestApiModel[]>(
      `${this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/party/guest/`
    );
  }

  public getGuestByAccreditationId(accreditationId: string): Observable<GuestAccreditionModel> {
    return this.http.get<any>(
      `${
        this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/private/${accreditationId}`
    );
  }

  public getGuestByPartId(guestId: string): Observable<GuestAccreditionModel> {
    return this.http.get<GuestAccreditionModel>(
      `${this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/party/guest/${guestId}`
    );
  }

  public getGuestsAccredititation(): Observable<GuestAccreditionModel[]> {
    return this.http.get<GuestAccreditionModel[]>(
      `${this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/accreditation/guest/`
    );
  }

  public editGuest(guest: GuestApiModel): Observable<GuestApiModel> {
    return this.http.put<GuestApiModel>(
      `${this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/v2/party/guest/${guest.id}`,
      guest,
      this.httpHeader
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
    return this.http.post<Blob>(
      `${
        this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/initiate/invitation-email/${guestId}`,
      null,
      {
        responseType: <any>'text',
        observe: 'response',
      }
    );
  }

  public deleteGuestByAccreditationId(accreditationId: string): Observable<any> {
    return this.http.patch<any>(
      `${
        this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/revoke/${accreditationId}`,
      {}
    );
  }

  public deleteGuestByPartyId(partyId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/api/party/guest/${partyId}`,
      {}
    );
  }
}
