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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';
import GuestFormModel from '../../models/guest-form.model';
import MyErrorStateMatcher from '../../../../core/error-handling/error-state-matcher';
import FormValidator from '../../../../shared/utilities/form-validator';

/**
 * Class representing the GuestFormComponent
 */
@Component({
  selector: 'app-guest-form',
  templateUrl: './guest-form.component.html',
  styleUrls: ['./guest-form.component.scss'],
  providers: [FormValidator],
})
export class GuestFormComponent {
  @Output()
  private readonly submitForm: EventEmitter<void> = new EventEmitter<void>();

  public today = new Date();

  public guestForm: FormGroup;

  public matcher = new MyErrorStateMatcher();

  public editMode = false;

  /**
   * Instantiates the GuestFormComponent. The guest form is created.
   * @param {FormBuilder} formBuilder - Construct a new `FormGroup` instance.
   * @param {FormValidator} formValidator - Contains validation functions for the form
   */
  public constructor(private readonly formBuilder: FormBuilder, private readonly formValidator: FormValidator) {
    this.guestForm = this.createGuestForm();
  }

  /**
   * Emits a submit event to show that the form was submitted.
   */
  public submit(): void {
    this.submitForm.emit();
  }

  /**
   * Populates the guest form with the given guest object
   * @param {GuestFormModel} guest - guest
   */
  public populateGuestForm(guest: GuestFormModel): void {
    this.editMode = true;
    this.guestForm.markAllAsTouched();
    this.guestForm.patchValue(
      {
        firstName: guest.firstName,
        lastName: guest.lastName,
        companyName: guest.companyName,
        title: guest.title,
        primaryPhone: guest.primaryPhone,
        secondaryPhone: guest.secondaryPhone,
        email: guest.email,
        typeOfVisit: guest.typeOfVisit,
        location: guest.location,
        validFromTime: this.getTimeFromIsoString(guest.validFromDate),
        validUntilTime: this.getTimeFromIsoString(guest.validUntilTime),
        issuedBy: guest.issuedBy,
      },
      { emitEvent: true }
    );

    this.guestForm.get('validFromDate')!.patchValue(this.extractDateFromIsoString(guest.validFromDate));
    this.guestForm.get('validUntilDate')!.patchValue(this.extractDateFromIsoString(guest.validUntilDate));
  }

  /**
   * Disables the fields companyName, email and issuedBy from the guest form
   */
  public disableFields(): void {
    this.guestForm.get('companyName')!.disable();
    this.guestForm.get('email')!.disable();
    this.guestForm.get('issuedBy')!.disable();
  }

  private createGuestForm(): FormGroup {
    return this.formBuilder.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            this.formValidator.requiredNoWhitespaceFill(),
            this.formValidator.forbiddenCharactersString(),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            this.formValidator.requiredNoWhitespaceFill(),
            this.formValidator.forbiddenCharactersString(),
          ],
        ],
        companyName: [
          '',
          [
            Validators.required,
            Validators.maxLength(200),
            this.formValidator.requiredNoWhitespaceFill(),
            this.formValidator.forbiddenCharactersString(),
          ],
        ],
        title: ['', [Validators.maxLength(50), this.formValidator.forbiddenCharactersString()]],
        primaryPhone: [
          '',
          [
            Validators.required,
            this.formValidator.requiredNoWhitespaceFill(),
            this.formValidator.forbiddenCharactersPhone(),
          ],
        ],
        secondaryPhone: ['', [this.formValidator.forbiddenCharactersPhone()]],
        email: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            Validators.email,
            this.formValidator.requiredNoWhitespaceFill(),
          ],
        ],
        typeOfVisit: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            this.formValidator.requiredNoWhitespaceFill(),
            this.formValidator.forbiddenCharactersString(),
          ],
        ],
        location: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            this.formValidator.requiredNoWhitespaceFill(),
            this.formValidator.forbiddenCharactersString(),
          ],
        ],
        validFromDate: ['', [Validators.required, this.formValidator.validDateString()]],
        validFromTime: ['', [Validators.required]],
        validUntilDate: ['', [Validators.required, this.formValidator.validDateString()]],
        validUntilTime: ['', [Validators.required]],
        issuedBy: [''],
      },
      {
        validator: [
          this.formValidator.checkTimeRange('validFromDate', 'validFromTime', 'validUntilDate', 'validUntilTime'),
        ],
      }
    );
  }

  private extractDateFromIsoString(date: string): Date {
    return new Date(date);
  }

  private getTimeFromIsoString(isoString: string): string {
    const inputDateTime = new Date(isoString);
    const min = (inputDateTime.getMinutes() < 10 ? '0' : '') + inputDateTime.getMinutes();
    const hour = (inputDateTime.getHours() < 10 ? '0' : '') + inputDateTime.getHours();

    return `${hour}:${min}`;
  }
}
