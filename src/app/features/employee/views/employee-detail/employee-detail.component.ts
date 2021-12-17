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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import EmployeeViewModel from '../../models/employee-view.model';
import EmployeeDetailStoreService from '../../services/stores/employee-detail.store.service';

/**
 * Class representing the EmployeeDetailComponent
 */
@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
})
export default class EmployeeDetailComponent implements OnInit {
  viewData$!: Observable<EmployeeViewModel>;

  /**
   * Instantiates the EmployeeDetailComponent.
   * @param {EmployeeDetailStoreService} store - employee detail store - holds functions related to employee details
   * @param {Router} router - A service that provides navigation among views and URL manipulation capabilities.
   */
  public constructor(private readonly store: EmployeeDetailStoreService, private readonly route: ActivatedRoute) {}

  /**
   * Initialisation function that initialises the store and connects to it to get data
   */
  public ngOnInit(): void {
    this.subscribe();
    this.init();
  }

  private subscribe(): void {
    this.viewData$ = this.store.connect();
  }

  private init() {
    const id = this.route.snapshot.paramMap.get('id');
    this.store.init(id);
  }
}
