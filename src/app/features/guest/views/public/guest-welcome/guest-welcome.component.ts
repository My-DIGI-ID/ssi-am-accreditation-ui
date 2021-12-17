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
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationURL } from '../../../../../shared/utilities/application-url';

/**
 * Class representing the GuestWelcomeComponent
 */
@Component({
  selector: 'app-welcome',
  templateUrl: './guest-welcome.component.html',
  styleUrls: ['./guest-welcome.component.scss'],
})
export default class GuestWelcomeComponent {
  public isFirstStepActive: boolean = true;

  public isConfirmCheckboxChecked: boolean = false;

  public guestId: string;

  /**
   * Instantiates the GuestWelcomeComponent, assigns value to the guestId from the URL
   * @param {Router} router - A service that provides navigation among views and URL manipulation capabilities.
   * @param {ActivatedRoute} activatedRoute - An observable of the URL segments matched by this route.
   */
  public constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute) {
    // TODO: where is from the ID?
    this.guestId = this.activatedRoute.snapshot.params.id;
  }

  /**
   * Marks first step as inactive
   */
  public nextStep(): void {
    this.isFirstStepActive = false;
  }

  /**
   * Shows or hides the visibility of the QR code.
   * @param {boolean} value - visibility value that can be true or false
   */
  public changeQRCodeVisibility(value: boolean): void {
    this.isConfirmCheckboxChecked = value;
  }

  /**
   * Navigates to the guest's accreditation page
   */
  public goToAccreditation(): void {
    this.router.navigate([ApplicationURL.GuestAccreditation, this.guestId]);
  }
}
