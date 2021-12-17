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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import AuthenticationGuard from '../../core/authentication/authentication.guard';
import EmployeeDetailComponent from './views/employee-detail/employee-detail.component';
import EmployeeAddComponent from './views/employee-add/employee-add.component';
import EmployeeCreationStatusComponent from './views/employee-creation-status/employee-creation-status.component';
import { EmployeeOverviewComponent } from './views/employee-overview/employee-overview.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: EmployeeOverviewComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: ['hr-admin'] },
  },
  {
    path: 'add-employee',
    component: EmployeeAddComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: ['hr-admin'] },
  },
  {
    path: 'detail/:id',
    component: EmployeeDetailComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: ['hr-admin', 'employee'] },
  },
  {
    path: 'creation-status',
    component: EmployeeCreationStatusComponent,
    canActivate: [AuthenticationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export default class EmployeeRoutingModule {}
