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
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationURL } from '../../../../shared/utilities/application-url';
import { GuestFormComponent } from '../../forms/guest-form/guest-form.component';
import GuestApiModel from '../../models/guest-api.model';
import GuestDashboardStoreService from '../../services/stores/guest-dashboard-store.service';
import FormValidator from '../../../../shared/utilities/form-validator';
import GuestFormModel from '../../models/guest-form.model';

/**
 * Class representing the GuestEditComponent
 */
@Component({
  selector: 'app-guest-edit',
  templateUrl: './guest-edit.component.html',
  styleUrls: ['./guest-edit.component.scss'],
})
export class GuestEditComponent implements AfterViewInit {
  @ViewChild(GuestFormComponent)
  private readonly guestFormComponent?: GuestFormComponent;

  /**
   * Instantiates the GuestEditComponent
   * @param {ActivatedRoute} activatedRoute - An observable of the URL segments matched by this route.
   * @param {GuestDashboardStoreService} guestDashboardStoreService - The guest dashboard store
   * @param {FormValidator} formValidator - A utility that holds form validation rules
   * @param {Router} router - A service that provides navigation among views and URL manipulation capabilities.
   */
  public constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly guestDashboardStoreService: GuestDashboardStoreService,
    public readonly formValidator: FormValidator,
    private readonly router: Router
  ) {}

  /**
   * A callback method that is invoked immediately after Angular has completed initialization of a component's view.
   * It is invoked only once when the view is instantiated.
   * It attempts to retrieve the guest by using the party ID and populate the guest form with it, and disable
   * the form fields.
   */
  public ngAfterViewInit(): void {
    try {
      const guestPartyId = this.activatedRoute.snapshot.params.id;
      this.guestDashboardStoreService.getGuestByPartyId(guestPartyId).subscribe((guest) => {
        this.guestFormComponent!.populateGuestForm(guest);
        this.guestFormComponent!.disableFields();
      });
    } catch (error) {
      console.log(error);
      // TODO-td: error handling
    }
  }

  /**
   * If the guest form is valid, an attempt to edit the guest data will be made
   */
  public submitEditGuest(): void {
    if (this.guestFormComponent?.guestForm.valid) {
      const guest = this.createGuestApiDTO();

      try {
        this.guestDashboardStoreService.editGuest(guest);
      } catch (error) {
        console.log(error);
        // TODO-tb: error handling
      }
    }
  }

  /**
   * Navigates to the guest page
   */
  public goToDashboard(): void {
    this.router.navigateByUrl(ApplicationURL.Guest);
  }

  /**
   * Creates a guest and returns it
   * @return {GuestApiModel} guest
   */
  private createGuestApiDTO(): GuestApiModel {
    const guestSanitize: GuestFormModel = this.sanitizeValues();

    const guestA: GuestApiModel = {
      id: this.activatedRoute.snapshot.params.id,
      title: guestSanitize.title,
      firstName: guestSanitize.firstName,
      lastName: guestSanitize.lastName,
      email: guestSanitize.email,
      companyName: guestSanitize.companyName,
      typeOfVisit: guestSanitize.typeOfVisit,
      location: guestSanitize.location,
      primaryPhoneNumber: guestSanitize.primaryPhone,
      secondaryPhoneNumber: guestSanitize.secondaryPhone,
      validFrom: this.extractDate(guestSanitize.validFromDate, guestSanitize.validFromTime),
      validUntil: this.extractDate(guestSanitize.validUntilDate, guestSanitize.validUntilTime),
    };

    return guestA;
  }

  /**
   * Returns the sanitized raw values of the guest form
   * @return {any} sanitized values of the guest form
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
