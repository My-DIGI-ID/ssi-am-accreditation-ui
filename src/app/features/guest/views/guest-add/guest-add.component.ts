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
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import GuestFormModel from '../../models/guest-form.model';
import { GuestFormComponent } from '../../forms/guest-form/guest-form.component';
import { ApplicationURL } from '../../../../shared/utilities/application-url';
import FormValidator from '../../../../shared/utilities/form-validator';
import GuestApiModel from '../../models/guest-api.model';
import GuestDashboardStoreService from '../../services/stores/guest-dashboard-store.service';

/**
 * Class representing the GuestAddComponent
 */
@Component({
  selector: 'app-guest-add',
  templateUrl: './guest-add.component.html',
  styleUrls: ['./guest-add.component.scss'],
  providers: [FormValidator],
})
export default class GuestAddComponent {
  @ViewChild(GuestFormComponent)
  private readonly guestFormComponent?: GuestFormComponent;

  /**
   * Instantiates the GuestAddComponent.
   * @param {FormValidator} formValidator - A utility that holds form validation rules
   * @param {GuestDashboardStoreService} guestDashboardStoreService - The guest dashboard store
   * @param {Router} router - A service that provides navigation among views and URL manipulation capabilities.
   */
  public constructor(
    public readonly formValidator: FormValidator,
    private readonly guestDashboardStoreService: GuestDashboardStoreService,
    private readonly router: Router
  ) {}

  /**
   * Submits the guest form in attempt to add the guest, by checking first the validity of the form.
   */
  public submitAddGuest(): void {
    if (this.guestFormComponent?.guestForm.valid) {
      const guest = this.createGuestApiDTO();

      try {
        this.guestDashboardStoreService.addGuest(guest);
      } catch (error) {
        console.log(error);
      }
    }
  }

  /**
   * Navigate to the guest page
   */
  public goToDashboard(): void {
    this.router.navigateByUrl(ApplicationURL.Guest);
  }

  /**
   * Create and return the guest with sanitized values
   * @return {GuestApiModel} guest
   */
  private createGuestApiDTO(): GuestApiModel {
    const guestSanitize: GuestFormModel = this.sanitizeValues();

    const guestA: GuestApiModel = {
      id: '',
      title: guestSanitize.title,
      firstName: guestSanitize.firstName,
      lastName: guestSanitize.lastName,
      primaryPhoneNumber: guestSanitize.primaryPhone,
      secondaryPhoneNumber: guestSanitize.secondaryPhone,
      email: guestSanitize.email,
      companyName: guestSanitize.companyName,
      typeOfVisit: guestSanitize.typeOfVisit,
      location: guestSanitize.location,
      validFrom: this.extractDate(guestSanitize.validFromDate, guestSanitize.validFromTime),
      validUntil: this.extractDate(guestSanitize.validUntilDate, guestSanitize.validUntilTime),
    };

    return guestA;
  }

  /**
   * Returns sanitized guest form values
   * @return {any} sanitized guest form
   */
  private sanitizeValues(): any {
    return this.formValidator.getSanitizedRawFormValues(this.guestFormComponent!.guestForm);
  }

  /**
   * If the provided date is valid, sets the hours and minutes to the ones from the provided time
   * and returns a string version of the date. If the date is invalid, it returns an empty string.
   * @param {string | Date} date - date
   * @param {string} time - time
   * @return {string} parsed date
   */
  private extractDate(date: string | Date, time: string): string {
    if (date instanceof Date) {
      // TODO: CHECKING THE TIME IS VALID
      date.setHours(parseInt(time.slice(0, 2), 10));
      date.setMinutes(parseInt(time.slice(3, 5), 10));

      return date.toISOString();
    }

    return '';
  }
}
