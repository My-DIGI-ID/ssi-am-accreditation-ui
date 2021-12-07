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

@Injectable({
  providedIn: 'root',
})
export default class GuestStoreService extends AbstractStore<GuestViewModel[]> {
  private basisIdIsProcessed: Subject<boolean> = new Subject();

  private credentialsOffered: Subject<boolean> = new Subject();

  public $credentialsOfferedObservable = this.credentialsOffered.asObservable();

  public constructor(
    private readonly guestApiService: GuestApiService,
    private readonly guestAccreditationApiService: GuestAccreditationApiService,
    private readonly router: Router
  ) {
    super();
  }

  protected buildStore(..._args: any): any {
    return this.guestApiService
      .getGuests()
      .pipe(map((apiModel: GuestApiModel[]) => apiModel.map((el) => Object.assign(new GuestViewModel(), el))));
  }

  public getGuestByAccreditationId(accreditationId: string): Observable<GuestAccreditionModel> {
    return this.guestApiService
      .getGuestByAccreditationId(accreditationId)
      .pipe(map((result: GuestAccreditionModel) => result));
  }

  public extendGuestData(guest: GuestExtendedApiModel, accreditationId: string): Observable<any> {
    return this.guestApiService.updateExtendedGuest(guest, accreditationId);
  }

  public getQRCode(accreditationId: string): Observable<string> {
    return this.guestAccreditationApiService
      .getQRCode(accreditationId)
      .pipe(
        map((qrCodeApiModel: GuestAccreditationQRCodeApiModel) => qrCodeApiModel.connectionQrCode.replace(/\\/g, ''))
      );
  }

  public offerCredential(accreditationId: string): void {
    this.guestAccreditationApiService.offerCredential(accreditationId).subscribe(() => {
      this.pollCredentialAcceptance(accreditationId).subscribe();
    });
  }

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
