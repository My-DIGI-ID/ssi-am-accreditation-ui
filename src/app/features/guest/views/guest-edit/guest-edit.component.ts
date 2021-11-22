/* eslint-disable class-methods-use-this */
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationURL } from '../../../../shared/utilities/application-url';
import { GuestFormComponent } from '../../forms/guest-form/guest-form.component';
import GuestApiModel from '../../models/guest-api.model';
import GuestDashboardStoreService from '../../services/stores/guest-dashboard-store.service';
import FormValidator from '../../../../shared/utilities/form-validator';
import GuestFormModel from '../../models/guest-form.model';

@Component({
  selector: 'app-guest-edit',
  templateUrl: './guest-edit.component.html',
  styleUrls: ['./guest-edit.component.scss'],
})
export class GuestEditComponent implements AfterViewInit {
  @ViewChild(GuestFormComponent)
  private readonly guestFormComponent?: GuestFormComponent;

  public constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly guestDashboardStoreService: GuestDashboardStoreService,
    public readonly formValidator: FormValidator,
    private readonly router: Router
  ) {}

  public ngAfterViewInit(): void {
    try {
      const guestPartyId = this.activatedRoute.snapshot.params.id;
      this.guestDashboardStoreService.getGuestByPartId(guestPartyId).subscribe((guest) => {
        this.guestFormComponent!.populateHotelForm(guest);
        this.guestFormComponent!.disableFields();
      });
    } catch (error) {
      console.log(error);
      // TODO-td: error handling
    }
  }

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

  public goToDashboard(): void {
    this.router.navigateByUrl(ApplicationURL.Guest);
  }

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
