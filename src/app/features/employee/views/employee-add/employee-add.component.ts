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

/* eslint-disable no-restricted-globals */
import { Component, OnInit } from '@angular/core';
import { UpdateAvailableEvent } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import NgswService from '../../../../shared/services/ngsw.service';
import EmployeeFormModel from '../../models/employee-form.model';
import EmployeeViewModel from '../../models/employee-view.model';
import EmployeeStoreService from '../../services/stores/employee.store.service';

/**
 * Class representing the EmployeeAddComponent
 */
@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss'],
})
export default class EmployeeAddComponent implements OnInit {
  viewData$!: Observable<EmployeeViewModel[]>;

  /**
   * Instantiates the EmployeeAddComponent
   * @param {EmployeeStoreService} store - employee store service - contains employee related functions
   * @param {NgswService} ngswService - Contains Service Worker functions
   * @param {Router} router - A service that provides navigation among views and URL manipulation capabilities.
   */
  public constructor(
    private readonly store: EmployeeStoreService,
    private readonly ngswService: NgswService,
    private readonly router: Router
  ) {}

  /**
   * Initialising function that initialises the employee store, connects to the store data and handles app updates
   */
  public ngOnInit(): void {
    this.init();
    this.subscribe();
    this.handleAppUpdates();
  }

  /**
   * Creates employee after submitting the employee form
   * @param {EmployeeFormModel} employeeFormModel - employee form
   */
  public handleEmployeeCreation(employeeFormModel: EmployeeFormModel): void {
    this.store.handleEmployeeCreation(employeeFormModel);
  }

  /**
   * In case of error, navigates to the /employee/creation-status page and displays the success status as false
   * @param {EmployeeFormModel} employeeFormModel - employee form
   */
  public onErrorMessage(errorMessage: string[]): void {
    this.router.navigate(['/employee/creation-status'], {
      state: {
        success: false,
        data: errorMessage,
      },
    });
  }

  /**
   * Navigates to the employee/dashboard page
   */
  public goToDashboard(): void {
    this.router.navigateByUrl('employee/dashboard');
  }

  /**
   * Retrieves employees through the store service
   */
  public fetchEmployees(): void {
    this.store.fetchEmployees();
  }

  /**
   * Saves the employees from the CSV once the CSV upload is done
   * @param {FormData} formData - form
   */
  public onCSVUpload(formData: FormData): void {
    this.store.handleCSVUpload(formData);
  }

  private subscribe(): void {
    this.viewData$ = this.store.connect();
  }

  private init(): void {
    this.store.init();
  }

  /**
   * @todo extend handling of service workers SwUpdate events in BKAACMGT-171
   */
  private handleAppUpdates(): void {
    if (this.ngswService.isEnabled()) {
      this.ngswService.isUpdateAvailable().subscribe((event: UpdateAvailableEvent) => {
        if (event.available) {
          // prompt user to update
          console.log('Current version is', event.current);
          // available version
          console.log('Available version is', event.available);

          if (confirm('Do you want to update?')) {
            this.ngswService.activateUpdate().then(() => document.location.reload());
          }
        }
      });
    }
  }
}
