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

import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import EmployeeApiModel from '../../models/employee-api.model';
import EmployeeViewModel from '../../models/employee-view.model';
import AbstractStore from '../../../../shared/abstractions/store.abstract';
import EmployeeApiService from '../api/employee.api.service';

/**
 * The purpose of this service is to hold the golden source of view data for entity
 * And being a mediator between views and higher level services
 * Handles side effects and data mutations
 * Though does NOT contain any mapping logic itself
 * @extends AbstractStore
 */
@Injectable({
  providedIn: 'root',
})
export default class EmployeeDetailStoreService extends AbstractStore<EmployeeViewModel> {
  /**
   * Instantiates the EmployeeDetailStoreService
   * @param {EmployeeApiService} employeeApiService - Service containing employee API related functions
   */
  constructor(private employeeApiService: EmployeeApiService) {
    super();
  }

  /**
   * Builds the employee detail store - retrieves employee with the ID given in the arguments
   * @param {any} args - args
   * @return {any} employee
   */
  protected buildStore(...args: any): any {
    const id: string = args[0];
    return this.employeeApiService
      .getEmployee(id)
      .pipe(map((apiModel: EmployeeApiModel) => Object.assign(new EmployeeViewModel(), apiModel)));
  }
}
