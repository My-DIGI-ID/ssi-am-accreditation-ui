/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export default class FormValidator {
  public forbiddenCharactersPhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const whitelistedCharacters = new RegExp(/[^\s- +()0-9]/gi);

      if (whitelistedCharacters.test(control.value)) {
        return { phoneContainsForbiddenCharacters: true };
      }

      return null;
    };
  }

  public forbiddenCharactersString(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const whitelistedCharacters = new RegExp(/[^\sa-z0-9,_.&äáâàăçéëêèïíììñóöôòøöșțüúüûùßẞ-]/gi);

      if (whitelistedCharacters.test(control.value)) {
        return { fieldContainsForbiddenCharacters: true };
      }

      return null;
    };
  }

  public requiredNoWhitespace(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const forbiddenCharactersRegex = new RegExp(/\s/g);

      if (forbiddenCharactersRegex.test(control.value)) {
        return { containsWhitespace: true };
      }

      return null;
    };
  }

  public requiredNoWhitespaceFill(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null || control.value.length === 0 || control.value.trim() === '') {
        return { required: true };
      }

      return null;
    };
  }

  public getSanitizedRawFormValues(form: FormGroup): any {
    return this.sanitizeRawFormValues(form.getRawValue());
  }

  public checkTimeRange(fromDate: string, fromTime: string, endDate: string, endTime: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const errorObject: { [key: string]: any } = {};

      if (group.controls[fromDate].value !== '' && group.controls[endDate].value !== '') {
        const fDate = group.controls[fromDate].value;
        const fTime = group.controls[fromTime].value;
        const eDate = group.controls[endDate].value;
        const eTime = group.controls[endTime].value;

        if (!group.controls[fromTime].errors?.required) {
          group.controls[fromTime].setErrors(null);
        }

        if (!group.controls[endTime].errors?.required) {
          group.controls[endTime].setErrors(null);
        }

        if (group.controls[fromTime].value !== '') {
          if (group.controls[endTime].value !== '') {
            if (this.isTimeString(fTime) && this.isDate(fDate) && this.isTimeString(eTime) && this.isDate(eDate)) {
              fDate.setHours(parseInt(fTime.slice(0, 2), 10));
              fDate.setMinutes(parseInt(fTime.slice(3, 5), 10));

              eDate.setHours(parseInt(eTime.slice(0, 2), 10));
              eDate.setMinutes(parseInt(eTime.slice(3, 5), 10));

              const today = new Date();

              const isRangeValid = fDate.getTime() - eDate.getTime() < 0;
              const isStartDateValid = today.getTime() - fDate.getTime() < 0;

              if (!isRangeValid && !isStartDateValid) {
                group.controls[endTime].setErrors(null);
                group.controls[fromTime].setErrors({ invalidStartDate: 'Start date is past' });
                group.controls[endTime].setErrors({ invalidDataRange: 'Not a valid range' });
                errorObject.invalidDataRange = 'Not a valid range';
                errorObject.invalidStartDate = 'Start date is past';

                return errorObject;
              }
              if (!isRangeValid) {
                const tmpfDate = fDate.toDateString().split(' ');
                const tmpeDate = eDate.toDateString().split(' ');
                if (tmpfDate[1] === tmpeDate[1] && tmpfDate[2] === tmpeDate[2] && tmpfDate[3] === tmpeDate[3]) {
                  group.controls[endTime].setErrors({ invalidDataRange: 'Not a valid range' });
                  errorObject.invalidDataRange = 'Not a valid range';
                } else {
                  group.controls[endDate].setErrors(null);
                  group.controls[endDate].setErrors({ invalidDataRange: 'Not a valid range' });
                  errorObject.invalidDataRange = 'Not a valid range';
                }

                return errorObject;
              }
              if (!isStartDateValid) {
                group.controls[fromTime].setErrors({ invalidStartDate: 'Start date is past' });
                errorObject.invalidStartDate = 'Start date is past';

                return errorObject;
              }
            }
          }
        } else if (this.isDate(fDate) && this.isDate(eDate)) {
          fDate!.setHours('00');
          fDate!.setMinutes('00');

          eDate!.setHours('00');
          eDate!.setMinutes('00');

          const isRangeValid = fDate.getTime() - eDate.getTime() <= 0;

          if (!isRangeValid) {
            group.controls[endDate].setErrors({ invalidDataRange: 'Not a valid range' });
            errorObject.invalidDataRange = 'Not a valid range';

            return errorObject;
          }
        }
      }

      return errorObject;
    };
  }

  private isDate(date: any): boolean {
    return date instanceof Date;
  }

  public validDateString(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // eslint-disable-next-line no-restricted-globals
      const isValidDate = this.isDate(control.value);

      if (!isValidDate) {
        return { isNotDateString: true };
      }

      return null;
    };
  }

  private isTimeString(timeString: string): boolean {
    const regexp = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (regexp.test(timeString)) {
      return true;
    }
    return false;
  }

  private sanitizeFormStringValue(value: string): string {
    return value.trim();
  }

  private sanitizeRawFormValues(rawFormValues: any): any {
    Object.keys(rawFormValues).forEach((key) => {
      if (typeof rawFormValues[key] === 'string') {
        rawFormValues[key] = this.sanitizeFormStringValue(rawFormValues[key]);
      } else if (Array.isArray(rawFormValues[key])) {
        rawFormValues[key].forEach((element: any) => this.sanitizeRawFormValues(element));
      }
    });

    return rawFormValues;
  }
}
