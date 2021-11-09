/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import FormValidator from '../../../../../../shared/utilities/form-validator';
import GuestApiModel from '../../../../models/guest-api.model';

@Component({
  selector: 'app-visit-and-guest-details',
  templateUrl: './visit-and-guest-details.component.html',
  styleUrls: ['./visit-and-guest-details.component.scss'],
  providers: [FormValidator],
})
export class VisitAndGuestDetailsComponent implements OnChanges {
  @Input() guest: GuestApiModel;

  @Output()
  private readonly submitForm: EventEmitter<void> = new EventEmitter<void>();

  public guestForm: FormGroup;

  public constructor(private readonly formBuilder: FormBuilder, private readonly formValidator: FormValidator) {
    this.guestForm = this.createGuestForm();
    this.disableFields();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.guest && changes.guest.currentValue) {
      this.populateGuestForm(changes.guest.currentValue);
    }
  }

  public populateGuestForm(guestApiDTO: GuestApiModel): void {
    this.guestForm.patchValue({
      firstName: guestApiDTO.firstName,
      lastName: guestApiDTO.lastName,
      title: guestApiDTO.title,
      email: guestApiDTO.email,
      primaryPhoneNumber: guestApiDTO.primaryPhoneNumber,
      secondaryPhoneNumber: guestApiDTO.secondaryPhoneNumber,
      companyName: guestApiDTO.companyName,
      typeOfVisit: guestApiDTO.typeOfVisit,
      location: guestApiDTO.location,
      validFromDate: this.getDateFromDTO(guestApiDTO.validFrom),
      validUntilDate: this.getDateFromDTO(guestApiDTO.validUntil),
      validFromTime: this.getTimeFromDTO(guestApiDTO.validFrom),
      validUntilTime: this.getTimeFromDTO(guestApiDTO.validUntil),
      issuedBy: guestApiDTO.issuedBy,
    });
  }

  public disableFields(): void {
    this.guestForm.get('firstName')!.disable();
    this.guestForm.get('lastName')!.disable();
    this.guestForm.get('title')!.disable();
    this.guestForm.get('email')!.disable();
    this.guestForm.get('companyName')!.disable();
    this.guestForm.get('typeOfVisit')!.disable();
    this.guestForm.get('location')!.disable();
    this.guestForm.get('validFromDate')!.disable();
    this.guestForm.get('validUntilDate')!.disable();
    this.guestForm.get('validFromTime')!.disable();
    this.guestForm.get('validUntilTime')!.disable();
    this.guestForm.get('issuedBy')!.disable();
  }

  private createGuestForm(): FormGroup {
    return this.formBuilder.group({
      firstName: [[{ value: '', disabled: true }], []],
      lastName: [[{ value: '', disabled: true }], []],
      title: [[{ value: '', disabled: true }], []],
      email: [[{ value: '', disabled: true }], []],
      primaryPhoneNumber: ['', [this.formValidator.forbiddenCharactersPhone()]],
      secondaryPhoneNumber: ['', [this.formValidator.forbiddenCharactersPhone()]],
      companyName: [[{ value: '', disabled: true }], []],
      typeOfVisit: [[{ value: '', disabled: true }], []],
      location: [[{ value: '', disabled: true }], []],
      validFromDate: [[{ value: '', disabled: true }], []],
      validUntilDate: [[{ value: '', disabled: true }], []],
      validFromTime: [[{ value: '', disabled: true }], []],
      validUntilTime: [[{ value: '', disabled: true }], []],
      issuedBy: [[{ value: '', disabled: true }], []],
      companyStreet: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          this.formValidator.requiredNoWhitespaceFill(),
          this.formValidator.forbiddenCharactersString(),
        ],
      ],
      companyCity: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          this.formValidator.requiredNoWhitespaceFill(),
          this.formValidator.forbiddenCharactersString(),
        ],
      ],
      companyPostCode: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          this.formValidator.requiredNoWhitespaceFill(),
          this.formValidator.forbiddenCharactersString(),
        ],
      ],
      licencePlateNumber: ['', [Validators.maxLength(50), this.formValidator.forbiddenCharactersString()]],
    });
  }

  public submit(): void {
    this.submitForm.emit();
  }

  private getDateFromDTO(date: string): string {
    if (date) {
      const inputDate = new Date(date);
      const dateArray = inputDate.toDateString().split(' ');

      return dateArray[2].concat(' ', dateArray[1], ' ', dateArray[3]);
    }
    return date;
  }

  private getTimeFromDTO(time: string): string {
    if (time) {
      const inputDate = new Date(time);

      return inputDate.toLocaleTimeString().slice(0, 5);
    }

    return time;
  }
}
