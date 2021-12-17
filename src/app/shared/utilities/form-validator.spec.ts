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

import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import FormValidator from './form-validator';

describe('FormValidator', () => {
  let formValidator: FormValidator;
  let testForm: FormGroup;
  let fb: FormBuilder;

  beforeEach(() => {
    formValidator = TestBed.inject(FormValidator);
    fb = new FormBuilder();
    testForm = fb.group({
      phone: new FormControl('', [formValidator.forbiddenCharactersPhone()]),
      specialChar: new FormControl('', [formValidator.forbiddenCharactersString()]),
      whitespace: new FormControl('', [formValidator.requiredNoWhitespace()]),
      whitespaceFill: new FormControl('', [formValidator.requiredNoWhitespaceFill()]),
      date: new FormControl('', [formValidator.validDateString()]),
    });
  });

  it('instance should be successfully created', () => {
    expect(formValidator).toBeTruthy();
  });

  it('if I set a good value to the phone input, I should not get error in the controls', () => {
    testForm.controls.phone.setValue('- +()09');

    expect(testForm.controls.phone.hasError('phoneContainsForbiddenCharacters')).toEqual(false);
  });

  it('if I set a forbidden character to the phone input, I should get error in the controls', () => {
    testForm.controls.phone.setValue('<');

    expect(testForm.controls.phone.hasError('phoneContainsForbiddenCharacters')).toEqual(true);
  });

  it('if I set a value without any forbidden characters, I should not get error in the controls', () => {
    testForm.controls.specialChar.setValue('az09,_.&äáâàăçéëêèïíììñóöôòøöșțüúüûùßẞ-');

    expect(testForm.controls.specialChar.hasError('fieldContainsForbiddenCharacters')).toEqual(false);
  });

  it('if I set a value with forbidden characters, I should get error in the controls', () => {
    testForm.controls.specialChar.setValue('<');

    expect(testForm.controls.specialChar.hasError('fieldContainsForbiddenCharacters')).toEqual(true);
  });

  it('if I set a value without whitespace, I should not get error in the controls', () => {
    testForm.controls.whitespace.setValue('123');

    expect(testForm.controls.whitespace.hasError('containsWhitespace')).toEqual(false);
  });

  it('if I set a value with whitespace, I should get error in the controls', () => {
    testForm.controls.whitespace.setValue('   ');

    expect(testForm.controls.whitespace.hasError('containsWhitespace')).toEqual(true);
  });

  it(`if I set a value with '123', I should not get error in the controls`, () => {
    testForm.controls.whitespaceFill.setValue('123');

    expect(testForm.controls.whitespaceFill.hasError('required')).toEqual(false);
  });

  it('if I set a value just with whitespace, I should get error in the controls', () => {
    testForm.controls.whitespaceFill.setValue(' ');

    expect(testForm.controls.whitespaceFill.hasError('required')).toEqual(true);
  });

  it('if I set a value with date type in a date input, I should not get error in the controls', () => {
    const today = new Date();
    testForm.controls.date.setValue(today);

    expect(testForm.controls.date.hasError('isNotDateString')).toEqual(false);
  });

  it('if I set a value without date type in a date input, I should get error in the controls', () => {
    testForm.controls.date.setValue('blabla');

    expect(testForm.controls.date.hasError('isNotDateString')).toEqual(true);
  });

  it('if I call the notTimeString function with a not time string, it should return false', () => {
    const notTimeString = 'blabla';

    // eslint-disable-next-line dot-notation
    expect(formValidator['isTimeString'](notTimeString)).toEqual(false);
  });

  it('if I call the getSanitizedRawFormValues function it should call the sanitizeRawFormValues on fromValidator', () => {
    const sanitizeRawFormValuesSpy = spyOn<any>(formValidator, 'sanitizeRawFormValues');
    formValidator.getSanitizedRawFormValues(testForm);

    expect(sanitizeRawFormValuesSpy).toHaveBeenCalled();
  });

  it('if I call the sanitizeRawFormValues function it should call the sanitizeFormStringValue on fromValidator', () => {
    const sanitizeFormStringValueSpy = spyOn<any>(formValidator, 'sanitizeFormStringValue');
    // eslint-disable-next-line dot-notation
    formValidator['sanitizeRawFormValues'](testForm);

    expect(sanitizeFormStringValueSpy).toHaveBeenCalled();
  });

  it('if I call the recursive sanitizeRawFormValues with an nasted object, it should be called recursively', () => {
    const test = {
      email: [
        {
          6: 'aniko@email.com',
          4: '6',
        },
      ],
    };
    const sanitizeRawFormValuesSpy = spyOn<any>(formValidator, 'sanitizeRawFormValues').and.callThrough();
    // eslint-disable-next-line dot-notation
    formValidator['sanitizeRawFormValues'](test);

    expect(sanitizeRawFormValuesSpy).toHaveBeenCalledTimes(2);
  });

  it('if I create a formGroup with a custom validator, the validator  should be called', () => {
    const checkTimeRangeSpy = spyOn(formValidator, 'checkTimeRange').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const testFormGroup: FormGroup = fb.group(
      {
        fromDate: new FormControl(''),
        fromTime: new FormControl(''),
        endDate: new FormControl(''),
        endTime: new FormControl(''),
      },
      {
        validator: [formValidator.checkTimeRange('fromDate', 'fromTime', 'endDate', 'endTime')],
      }
    );

    expect(checkTimeRangeSpy).toHaveBeenCalledWith('fromDate', 'fromTime', 'endDate', 'endTime');
  });

  describe('checking the timeRange validator', () => {
    let timeFormGroup: FormGroup;
    const yesterday = new Date();
    const today = new Date();
    const tomorrow = new Date();
    const afterTomorrow = new Date();

    yesterday.setDate(yesterday.getDate() - 1);
    tomorrow.setDate(tomorrow.getDate() + 1);
    afterTomorrow.setDate(afterTomorrow.getDate() + 2);

    beforeEach(() => {
      timeFormGroup = fb.group(
        {
          fromDate: new FormControl(''),
          fromTime: new FormControl(''),
          endDate: new FormControl(''),
          endTime: new FormControl(''),
        },
        {
          validator: [formValidator.checkTimeRange('fromDate', 'fromTime', 'endDate', 'endTime')],
        }
      );
    });

    it('if I set the starting date: tomorrow, and ending date: after tomorrow, I should not get any errors', () => {
      timeFormGroup.controls.fromDate.setValue(tomorrow);
      timeFormGroup.controls.endDate.setValue(afterTomorrow);

      expect(timeFormGroup.controls.fromDate.errors).toBeNull();
      expect(timeFormGroup.controls.endDate.errors).toBeNull();
      expect(timeFormGroup.controls.fromTime.errors).toBeNull();
      expect(timeFormGroup.controls.endTime.errors).toBeNull();
    });

    it('if I set the starting date: tomorrow, and ending date: tomorrow, I should not get any errors', () => {
      timeFormGroup.controls.fromDate.setValue(tomorrow);
      timeFormGroup.controls.endDate.setValue(tomorrow);

      expect(timeFormGroup.controls.fromDate.errors).toBeNull();
      expect(timeFormGroup.controls.endDate.errors).toBeNull();
      expect(timeFormGroup.controls.fromTime.errors).toBeNull();
      expect(timeFormGroup.controls.endTime.errors).toBeNull();
    });

    it('if I set the starting date: tomorrow (10:00), and ending date: after tomorrow (17:00), I should not get any errors', () => {
      timeFormGroup.controls.fromDate.setValue(tomorrow);
      timeFormGroup.controls.endDate.setValue(afterTomorrow);
      timeFormGroup.controls.fromTime.setValue('10:00');
      timeFormGroup.controls.endTime.setValue('17:00');

      expect(timeFormGroup.controls.fromDate.errors).toBeNull();
      expect(timeFormGroup.controls.endDate.errors).toBeNull();
      expect(timeFormGroup.controls.fromTime.errors).toBeNull();
      expect(timeFormGroup.controls.endTime.errors).toBeNull();
    });

    it('if I set the starting date: tomorrow, and ending date: yesterday, I should get invalidDataRange error', () => {
      timeFormGroup.controls.fromDate.setValue(tomorrow);
      timeFormGroup.controls.endDate.setValue(yesterday);
      timeFormGroup.controls.fromTime.setValue('10:00');
      timeFormGroup.controls.endTime.setValue('17:00');

      expect(timeFormGroup.controls.fromDate.errors).toBeNull();
      expect(timeFormGroup.controls.endDate.hasError('invalidDataRange')).toEqual(true);
      expect(timeFormGroup.controls.fromTime.errors).toBeNull();
      expect(timeFormGroup.controls.endTime.errors).toBeNull();
    });

    it('if I set the starting date: tomorrow, and ending date: tomorrow, I should get invalidDataRange error', () => {
      timeFormGroup.controls.fromDate.setValue(tomorrow);
      timeFormGroup.controls.endDate.setValue(tomorrow);
      timeFormGroup.controls.fromTime.setValue('18:00');
      timeFormGroup.controls.endTime.setValue('17:00');

      expect(timeFormGroup.controls.fromDate.errors).toBeNull();
      expect(timeFormGroup.controls.endDate.errors).toBeNull();
      expect(timeFormGroup.controls.fromTime.errors).toBeNull();
      expect(timeFormGroup.controls.endTime.hasError('invalidDataRange')).toEqual(true);
    });

    it('if I set the starting date: yesterday, and ending date: today, I should get invalidStartDate error', () => {
      timeFormGroup.controls.fromDate.setValue(yesterday);
      timeFormGroup.controls.endDate.setValue(today);
      timeFormGroup.controls.fromTime.setValue('10:00');
      timeFormGroup.controls.endTime.setValue('17:00');

      expect(timeFormGroup.controls.fromDate.errors).toBeNull();
      expect(timeFormGroup.controls.endDate.errors).toBeNull();
      expect(timeFormGroup.controls.fromTime.hasError('invalidStartDate')).toEqual(true);
      expect(timeFormGroup.controls.endTime.errors).toBeNull();
    });

    it('if I set the starting date: yesterday (20:00), and ending date: yesterday(05:00), I should get invalidStartDate, and invalidDataRange error', () => {
      timeFormGroup.controls.fromDate.setValue(yesterday);
      timeFormGroup.controls.endDate.setValue(yesterday);
      timeFormGroup.controls.fromTime.setValue('20:00');
      timeFormGroup.controls.endTime.setValue('05:00');

      expect(timeFormGroup.controls.fromDate.errors).toBeNull();
      expect(timeFormGroup.controls.endDate.errors).toBeNull();
      expect(timeFormGroup.controls.fromTime.hasError('invalidStartDate')).toEqual(true);
      expect(timeFormGroup.controls.endTime.hasError('invalidDataRange')).toEqual(true);
    });
  });
});
