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

/**
 * Class representing the GuestAccreditationComponent
 */
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

  /**
   * Instantiates the GuestAccreditationComponent
   * @param {FormValidator} formValidator - A utility that holds from validation rules
   * @param {ActivatedRoute} activatedRoute - An observable of the URL segments matched by this route.
   * @param {GuestStoreService} guestStoreService - A service that holds all the guest store functions
   */
  public constructor(
    public readonly formValidator: FormValidator,
    private readonly activatedRoute: ActivatedRoute,
    private readonly guestStoreService: GuestStoreService
  ) {}

  /**
   * Initialisation function that sets the value of the guestId based on the value taken from the URL
   * and accepts accreditation once the credentials are offered
   */
  public ngOnInit(): void {
    this.guestId = this.activatedRoute.snapshot.params.id;
    this.guestStoreService.$credentialsOfferedObservable.subscribe(() => {
      this.accreditationAccepted = true;
    });
  }

  /**
   * Advances from first step to the second and retrieves the guest
   */
  public goSecondPage(): void {
    this.activeStepNumber = 2;
    this.stepOneDone = true;

    this.getGuestDTO(this.guestId);
  }

  /**
   * If the QR is scanned, goes to second page
   * @param {boolean} isScanned - value that shows whether or not the QR was already scanned
   */
  public onQRCodeIsScanned(isScanned: boolean): void {
    if (isScanned) {
      this.goSecondPage();
    }
  }

  /**
   * Submits the guest details in the shape of a form, if the form is valid the guest extended DTO is created.
   * Once the guest data gets extended, the step two finishes and step three becomes active and credentials are offered
   */
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

  /**
   * Retrieves guest DTO based on its ID
   * @param {string} id - value of accreditation ID
   */
  private getGuestDTO(id: string): void {
    try {
      this.guestStoreService.getGuestByAccreditationId(id).subscribe((guest_: GuestAccreditionModel) => {
        this.guest = guest_.guest;
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Creates and returns extended guest DTO by sanitizing the guest form and assigning fields individually to the extendedDTO
   * @return {GuestExtendedApiModel} id - value of accreditation ID
   */
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
