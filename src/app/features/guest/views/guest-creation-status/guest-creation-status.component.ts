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

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationURL } from '../../../../shared/utilities/application-url';

/**
 * Class representing the GuestCreationStatusComponent
 */
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

  /**
   * Instantiates the GuestCreationStatusComponent. The navigation state is being instantiated
   * @param {Router} router - A service that provides navigation among views and URL manipulation capabilities.
   * @param {TranslateService} translate - Internationalisation service
   */
  public constructor(private readonly router: Router, private readonly translate: TranslateService) {
    this.navigationState = this.router.getCurrentNavigation();
    this.isGuestAddSuccess = this.navigationState!.extras.state?.success;
  }

  /**
   * If the guest is added successfully, it returns the success title. Otherwise it returns the error title.
   * @return {string} title (success/error)
   */
  public getStatusTitle(): string {
    return this.isGuestAddSuccess ? this.successTitle : this.errorTitle;
  }

  /**
   * If the guest is added successfully, it returns the success description. Otherwise it returns the error description.
   * @return {string} description (success/error)
   */
  public getStatusDescription(): string {
    return this.isGuestAddSuccess ? this.successDescription : this.errorDescription;
  }

  /**
   * Navigates to the guest/add page
   */
  public goToAddGuest(): void {
    this.router.navigateByUrl(ApplicationURL.GuestAdd);
  }

  /**
   * Navigates to the guest/dashboard page
   */
  public goToDashboard(): void {
    this.router.navigateByUrl(ApplicationURL.GuestDashboard);
  }
}
