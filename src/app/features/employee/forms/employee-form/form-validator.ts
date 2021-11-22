/* eslint-disable class-methods-use-this */
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

@Injectable()
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
      const whitelistedCharacters = new RegExp(/[^\sa-z0-9_.&äáâàăçéëêèïíììñóöôòøöșțüúüûùßẞ-]/gi);

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

  private sanitizeFormStringValue(value: string): string {
    return value.trim();
  }

  private sanitizeRawFormValues(rawFormValues: any): any {
    Object.keys(rawFormValues).forEach((key) => {
      if (typeof rawFormValues[key] === 'string') {
        // eslint-disable-next-line no-param-reassign
        rawFormValues[key] = this.sanitizeFormStringValue(rawFormValues[key]);
      } else if (Array.isArray(rawFormValues[key])) {
        rawFormValues[key].forEach((element: any) => this.sanitizeRawFormValues(element));
      }
    });

    return rawFormValues;
  }
}
