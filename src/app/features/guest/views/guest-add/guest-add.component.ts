/* eslint-disable class-methods-use-this */
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import GuestFormModel from '../../models/guest-form.model';
import { GuestFormComponent } from '../../forms/guest-form/guest-form.component';
import { ApplicationURL } from '../../../../shared/utilities/application-url';
import FormValidator from '../../../../shared/utilities/form-validator';
import GuestApiModel from '../../models/guest-api.model';
import GuestDashboardStoreService from '../../services/stores/guest-dashboard-store.service';

@Component({
  selector: 'app-guest-add',
  templateUrl: './guest-add.component.html',
  styleUrls: ['./guest-add.component.scss'],
  providers: [FormValidator],
})
export default class GuestAddComponent {
  @ViewChild(GuestFormComponent)
  private readonly guestFormComponent?: GuestFormComponent;

  public constructor(
    public readonly formValidator: FormValidator,
    private readonly guestDashboardStoreService: GuestDashboardStoreService,
    private readonly router: Router
  ) {}

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

  public goToDashboard(): void {
    this.router.navigateByUrl(ApplicationURL.Guest);
  }

  private createGuestApiDTO(): GuestApiModel {
    const guestSanitize: GuestFormModel = this.sanitizeValues();

    const guestA: GuestApiModel = {
      id: '',
      title: guestSanitize.title,
      firstName: guestSanitize.firstName,
      lastName: guestSanitize.lastName,
      email: guestSanitize.email,
      companyName: guestSanitize.companyName,
      typeOfVisit: guestSanitize.typeOfVisit,
      location: guestSanitize.location,
      validFrom: this.extractDate(guestSanitize.validFromDate, guestSanitize.validFromTime),
      validUntil: this.extractDate(guestSanitize.validUntilDate, guestSanitize.validUntilTime),
    };

    return guestA;
  }

  private sanitizeValues(): any {
    return this.formValidator.getSanitizedRawFormValues(this.guestFormComponent!.guestForm);
  }

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
