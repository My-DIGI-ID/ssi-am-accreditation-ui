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
import EmployeeViewModel from '../../models/employee-view.model';

/**
 * Class representing the EmployeeCreationStatusComponent
 */
@Component({
  selector: 'app-employee-creation-status',
  templateUrl: './employee-creation-status.component.html',
  styleUrls: ['./employee-creation-status.component.scss'],
})
export default class EmployeeCreationStatusComponent {
  public navigationState;

  public success: boolean = false;

  public employees: Array<EmployeeViewModel> = [];

  public errorMessage: string;

  private readonly successHeader: string = this.translate.instant(
    'employee.employee-creation-status-component.success.header'
  );

  private readonly successText: string = this.translate.instant(
    'employee.employee-creation-status-component.success.text'
  );

  private readonly errorHeader: string = this.translate.instant(
    'employee.employee-creation-status-component.error.header'
  );

  private readonly errorText: string = this.translate.instant('employee.employee-creation-status-component.error.text');

  /**
   * Instantiates the EmployeeCreationStatusComponent. The current navigation state and the employees data/error message are recorded
   * @param {Router} router - A service that provides navigation among views and URL manipulation capabilities.
   * @param {TranslateService} translate - The internationalisation service
   */
  public constructor(public router: Router, private readonly translate: TranslateService) {
    this.navigationState = this.router.getCurrentNavigation();

    this.success = this.navigationState!.extras.state?.success;
    if (this.success) {
      this.employees = this.navigationState!.extras.state?.data;
    } else {
      this.errorMessage = this.navigationState!.extras.state?.data;
    }
  }

  /**
   * Retrieves the header text
   * @return {string} header text - either success or error
   */
  public getHeaderText(): string {
    return this.success ? this.successHeader : this.errorHeader;
  }

  /**
   * Retrieves the status text
   * @return {string} status text - either success or error
   */
  public getStatusText(): string {
    return this.success ? this.successText : this.errorText;
  }

  /**
   * Navigates to the employee/add-employee page
   */
  public goToAddEmployee(): void {
    this.router.navigateByUrl('employee/add-employee');
  }

  /**
   * Navigates to the employee/dashboard page
   */
  public goToDashboard(): void {
    this.router.navigateByUrl('employee/dashboard');
  }
}
