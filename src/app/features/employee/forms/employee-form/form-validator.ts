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
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

/**
 * Class representing the FormValidator
 */
@Injectable()
export default class FormValidator {
  /**
   * Phone fields validator that makes sure no forbidden characters are present in the respective field.
   * @return {ValidatorFn} validator
   */
  public forbiddenCharactersPhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const whitelistedCharacters = new RegExp(/[^\s- +()0-9]/gi);

      if (whitelistedCharacters.test(control.value)) {
        return { phoneContainsForbiddenCharacters: true };
      }

      return null;
    };
  }

  /**
   * Generic string validator that makes sure no forbidden characters are present in the respective field.
   * @return {ValidatorFn} validator
   */
  public forbiddenCharactersString(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const whitelistedCharacters = new RegExp(/[^\sa-z0-9_.&äáâàăçéëêèïíììñóöôòøöșțüúüûùßẞ-]/gi);

      if (whitelistedCharacters.test(control.value)) {
        return { fieldContainsForbiddenCharacters: true };
      }

      return null;
    };
  }

  /**
   * Whitespace validator that makes sure no whitespaces are present in the field where the validator is applied
   * @return {ValidatorFn} validator
   */
  public requiredNoWhitespace(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const forbiddenCharactersRegex = new RegExp(/\s/g);

      if (forbiddenCharactersRegex.test(control.value)) {
        return { containsWhitespace: true };
      }

      return null;
    };
  }

  /**
   * Whitespace validator that makes sure no whitespaces are present in the beginning and the end of the string that is being checked
   * @return {ValidatorFn} validator
   */
  public requiredNoWhitespaceFill(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null || control.value.length === 0 || control.value.trim() === '') {
        return { required: true };
      }

      return null;
    };
  }

  /**
   * Sanitizes the form
   * @param {FormGroup} form - form values
   * @return {any} - sanitized form values
   */
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
