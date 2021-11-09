/* eslint-disable import/prefer-default-export */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationURL } from '../../../../shared/utilities/application-url';

@Component({
  selector: 'app-guest-creation-status',
  templateUrl: './guest-creation-status.component.html',
  styleUrls: ['./guest-creation-status.component.scss'],
})
export class GuestCreationStatusComponent {
  public isGuestAddSuccess: boolean = false;

  public successTitle = this.translate.instant('guest.guest-creation-status-component.success.header');

  public errorTitle = this.translate.instant('guest.guest-creation-status-component.error.header');

  public successDescription = this.translate.instant('guest.guest-creation-status-component.success.text');

  public errorDescription = this.translate.instant('guest.guest-creation-status-component.error.text');

  public navigationState;

  public constructor(private readonly router: Router, private readonly translate: TranslateService) {
    this.navigationState = this.router.getCurrentNavigation();
    this.isGuestAddSuccess = this.navigationState!.extras.state?.success;
  }

  public getStatusTitle(): string {
    return this.isGuestAddSuccess ? this.successTitle : this.errorTitle;
  }

  public getStatusDescription(): string {
    return this.isGuestAddSuccess ? this.successDescription : this.errorDescription;
  }

  public goToAddGuest(): void {
    this.router.navigateByUrl(ApplicationURL.GuestAdd);
  }

  public goToDashboard(): void {
    this.router.navigateByUrl(ApplicationURL.GuestDashboard);
  }
}
