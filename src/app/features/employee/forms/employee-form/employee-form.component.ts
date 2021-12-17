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

import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IEmployeeStatus } from '../../interfaces/employee-status.interface';
import EmployeeFormModel from '../../models/employee-form.model';
import FormValidator from '../../../../shared/utilities/form-validator';

/**
 * Class representing the EmployeeFormComponent
 */
@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  providers: [FormValidator],
})
export default class EmployeeFormComponent implements OnInit {
  @Input() initialValue: EmployeeFormModel;

  @Output() submitForm: EventEmitter<EmployeeFormModel> = new EventEmitter();

  public employeeFormGroup: FormGroup;

  public readonly employeeStatuses: Array<IEmployeeStatus> = [
    {
      value: 'INTERNAL',
      viewValue: this.translate.instant('employee.employee-add-component.form.employee-status-enum.internal'),
    },
    {
      value: 'EXTERNAL',
      viewValue: this.translate.instant('employee.employee-add-component.form.employee-status-enum.external'),
    },
    {
      value: 'SERVICE PROVIDER',
      viewValue: this.translate.instant('employee.employee-add-component.form.employee-status-enum.service-provider'),
    },
  ];

  /**
   * Instantiates the EmployeeFormComponent
   * @param {FormBuilder} formBuilder - Creates an AbstractControl from a user-specified configuration.
   * @param {FormValidator} formValidator - Contains validation functions to use on the form fields.
   * @param {TranslateService} translate - Internationalisation service
   */
  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly formValidator: FormValidator,
    private readonly translate: TranslateService
  ) {}

  /**
   * Initialisation function that also initialises the employee form
   */
  public ngOnInit(): void {
    this.employeeFormGroup = this.initEmployeeForm();
  }

  /**
   * Creates employee and emits a submit event with the created employee
   */
  public submitEmployee(): void {
    const employee: EmployeeFormModel = this.createEmployee();

    this.submitForm.emit(employee);
  }

  private initEmployeeForm(): FormGroup {
    return this.formBuilder.group({
      firstName: [
        this.initialValue.firstName,
        [
          Validators.required,
          Validators.maxLength(50),
          this.formValidator.requiredNoWhitespaceFill(),
          this.formValidator.forbiddenCharactersString(),
        ],
      ],
      lastName: [
        this.initialValue.lastName,
        [
          Validators.required,
          Validators.maxLength(50),
          this.formValidator.requiredNoWhitespaceFill(),
          this.formValidator.forbiddenCharactersString(),
        ],
      ],
      primaryPhone: [
        this.initialValue.primaryPhone,
        [
          Validators.required,
          this.formValidator.requiredNoWhitespaceFill(),
          this.formValidator.forbiddenCharactersPhone(),
        ],
      ],
      secondaryPhone: [this.initialValue.secondaryPhone, [this.formValidator.forbiddenCharactersPhone()]],
      title: [this.initialValue.title, [Validators.maxLength(50), this.formValidator.forbiddenCharactersString()]],
      email: [
        this.initialValue.email,
        [Validators.required, Validators.email, this.formValidator.requiredNoWhitespaceFill()],
      ],
      employeeStatus: [this.initialValue.employeeStatus, [Validators.required]],
      employeeId: [
        this.initialValue.employeeId,
        [Validators.maxLength(50), this.formValidator.forbiddenCharactersString()],
      ],
      employeeRole: [
        this.initialValue.employeeRole,
        [Validators.maxLength(50), this.formValidator.forbiddenCharactersString()],
      ],
      firmName: [
        this.initialValue.firmName,
        [
          Validators.required,
          Validators.maxLength(100),
          this.formValidator.requiredNoWhitespaceFill(),
          this.formValidator.forbiddenCharactersString(),
        ],
      ],
      firmStreet: [
        this.initialValue.firmStreet,
        [
          Validators.required,
          Validators.maxLength(50),
          this.formValidator.requiredNoWhitespaceFill(),
          this.formValidator.forbiddenCharactersString(),
        ],
      ],
      firmPostalCode: [
        this.initialValue.firmPostalCode,
        [
          Validators.required,
          Validators.maxLength(50),
          this.formValidator.requiredNoWhitespaceFill(),
          this.formValidator.forbiddenCharactersString(),
        ],
      ],
      firmCity: [
        this.initialValue.firmCity,
        [
          Validators.required,
          Validators.maxLength(50),
          this.formValidator.requiredNoWhitespaceFill(),
          this.formValidator.forbiddenCharactersString(),
        ],
      ],
      firmReference: [
        this.initialValue.firmReference,
        [Validators.maxLength(50), this.formValidator.forbiddenCharactersString()],
      ],
    });
  }

  private createEmployee(): EmployeeFormModel {
    const formValues = this.formValidator.getSanitizedRawFormValues(this.employeeFormGroup);

    return {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      primaryPhone: formValues.primaryPhone,
      secondaryPhone: formValues.secondaryPhone,
      title: formValues.title,
      email: formValues.email,
      employeeStatus: formValues.employeeStatus,
      employeeId: formValues.employeeId,
      employeeRole: formValues.employeeRole,
      firmCity: formValues.firmCity,
      firmName: formValues.firmName,
      firmPostalCode: formValues.firmPostalCode,
      firmStreet: formValues.firmStreet,
      firmReference: formValues.firmReference,
    };
  }
}
