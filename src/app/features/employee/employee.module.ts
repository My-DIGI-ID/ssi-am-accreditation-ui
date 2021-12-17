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

import { TranslatePipe, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorIntlGerman } from '../../shared/utilities/german-paginator-intl';
import SharedModule from '../../shared/shared.module';
import EmployeeRoutingModule from './employee-routing.module';
import EmployeeFormComponent from './forms/employee-form/employee-form.component';
import EmployeeApiService from './services/api/employee.api.service';
import EmployeeDetailStoreService from './services/stores/employee-detail.store.service';
import EmployeeStoreService from './services/stores/employee.store.service';
import EmployeeDetailComponent from './views/employee-detail/employee-detail.component';
import EmployeeAddComponent from './views/employee-add/employee-add.component';
import EmployeeCreationStatusComponent from './views/employee-creation-status/employee-creation-status.component';
import { EmployeeOverviewComponent } from './views/employee-overview/employee-overview.component';

@NgModule({
  declarations: [
    EmployeeDetailComponent,
    EmployeeFormComponent,
    EmployeeAddComponent,
    EmployeeCreationStatusComponent,
    EmployeeOverviewComponent,
  ],
  providers: [
    EmployeeApiService,
    EmployeeStoreService,
    EmployeeDetailStoreService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlGerman },
    TranslatePipe,
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    TranslateModule,
    SharedModule,
  ],
})
export default class EmployeeModule {}
