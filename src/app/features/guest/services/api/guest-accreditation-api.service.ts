import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ConfigInitService from 'src/app/init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export default class GuestAccreditationApiService {
  public httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private readonly http: HttpClient, private readonly configServie: ConfigInitService) {}

  public getBasisIdCheckCompletionStatus(accreditationId: string): Observable<any> {
    // @ToDo: make the endpoint more configurable
    return this.http.get(
      `${
        this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/validate/basis-id-process-completion/${accreditationId}`
    );
  }

  public getQRCode(accreditationId: string): Observable<any> {
    return this.http.patch(
      `${
        this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/proceed/qr-code/${accreditationId}`,
      {}
    );
  }

  public offerCredential(accreditationId: string): Observable<any> {
    return this.http.patch(
      `${
        this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/offer/${accreditationId}`,
      {}
    );
  }

  public getAccreditationCompletionStatus(accreditationId: string): Observable<any> {
    return this.http.get(
      `${
        this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL
      }/api/v2/accreditation/guest/validate/accreditation-process-completion/${accreditationId}`
    );
  }
}
