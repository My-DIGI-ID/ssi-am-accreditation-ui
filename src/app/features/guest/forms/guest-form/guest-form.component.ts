/* eslint-disable class-methods-use-this */
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';
import GuestFormModel from '../../models/guest-form.model';
import MyErrorStateMatcher from '../../../../core/error-handling/error-state-matcher';
import FormValidator from '../../../../shared/utilities/form-validator';

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

  public constructor(private readonly formBuilder: FormBuilder, private readonly formValidator: FormValidator) {
    this.guestForm = this.createGuestForm();
  }

  public submit(): void {
    this.submitForm.emit();
  }

  public populateHotelForm(guest: GuestFormModel): void {
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
