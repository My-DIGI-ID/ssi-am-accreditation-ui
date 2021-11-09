/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import GuestAccreditionModel from '../../../models/guest-accreditation.model';
import GuestExtendedApiModel from '../../../models/guest-extended-api.model';
import { VisitAndGuestDetailsComponent } from './visit-and-guest-details/visit-and-guest-details.component';
import GuestStoreService from '../../../services/stores/guest-store.service';
import GuestApiModel from '../../../models/guest-api.model';
import FormValidator from '../../../../../shared/utilities/form-validator';
import GuestExtendedFormModel from '../../../models/guest-extended-form.model';

@Component({
  selector: 'app-guest-accreditation',
  templateUrl: './guest-accreditation.component.html',
  styleUrls: ['./guest-accreditation.component.scss'],
  providers: [FormValidator],
})
export class GuestAccreditationComponent implements OnInit {
  @ViewChild(VisitAndGuestDetailsComponent)
  private readonly visitAndGuestDetailsComponent?: VisitAndGuestDetailsComponent;

  public activeStepNumber: number = 1;

  public stepOneDone: boolean = false;

  public stepTwoDone: boolean = false;

  public guest: GuestApiModel;

  private guestId: string;

  public accreditationAccepted = false;

  public constructor(
    public readonly formValidator: FormValidator,
    private readonly activatedRoute: ActivatedRoute,
    private readonly guestStoreService: GuestStoreService
  ) {}

  public ngOnInit(): void {
    this.guestId = this.activatedRoute.snapshot.params.id;
    this.guestStoreService.$credentialsOfferedObservable.subscribe(() => {
      this.accreditationAccepted = true;
    });
  }

  public goSecondPage(): void {
    this.activeStepNumber = 2;
    this.stepOneDone = true;

    this.getGuestDTO(this.guestId);
  }

  public onQRCodeIsScanned(isScanned: boolean): void {
    if (isScanned) {
      this.goSecondPage();
    }
  }

  public submitGuestDetails(): void {
    if (this.visitAndGuestDetailsComponent?.guestForm.valid) {
      const guestExtendedDTO = this.createGuestExtendedDTO();

      try {
        this.guestStoreService
          .extendGuestData(guestExtendedDTO, this.guestId)
          .pipe(take(1))
          .subscribe((_extendedGuestData: GuestAccreditionModel) => {
            this.activeStepNumber = 3;
            this.stepTwoDone = true;
            this.guestStoreService.offerCredential(this.guestId);
          });
      } catch (httpErrorResponse) {
        // TODO notification
      }
    }
  }

  private getGuestDTO(id: string): void {
    try {
      this.guestStoreService.getGuestById(id).subscribe((guest_: GuestAccreditionModel) => {
        this.guest = guest_.guest;
      });
    } catch (error) {
      console.log(error);
    }
  }

  private createGuestExtendedDTO(): GuestExtendedApiModel {
    const formValues: GuestExtendedFormModel = this.formValidator.getSanitizedRawFormValues(
      this.visitAndGuestDetailsComponent!.guestForm
    );
    const extendedGuest = new GuestExtendedApiModel();
    extendedGuest.primaryPhoneNumber = formValues.primaryPhoneNumber;
    extendedGuest.secondaryPhoneNumber = formValues.secondaryPhoneNumber;
    extendedGuest.companyCity = formValues.companyCity;
    extendedGuest.companyStreet = formValues.companyStreet;
    extendedGuest.companyPostCode = formValues.companyPostCode;
    extendedGuest.licencePlateNumber = formValues.licencePlateNumber;
    extendedGuest.acceptedDocument = 'Passport';

    return extendedGuest;
  }
}
