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
import GuestAddComponent from './views/guest-add/guest-add.component';
import GuestOverviewComponent from './views/guest-overview/guest-overview.component';
import GuestWelcomeComponent from './views/public/guest-welcome/guest-welcome.component';
import { GuestAccreditationComponent } from './views/public/guest-accreditation/guest-accreditation.component';
import { GuestCreationStatusComponent } from './views/guest-creation-status/guest-creation-status.component';
import { GuestEditComponent } from './views/guest-edit/guest-edit.component';

// TODO-td: using APPLICATION URL enum
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'welcome/:id',
    component: GuestWelcomeComponent,
  },
  {
    path: 'accreditation/:id',
    component: GuestAccreditationComponent,
  },
  {
    path: 'dashboard',
    component: GuestOverviewComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: ['employee'] },
  },
  {
    path: 'add',
    component: GuestAddComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: ['employee'] },
  },
  {
    path: ':id/edit',
    component: GuestEditComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: ['employee'] },
  },
  {
    path: 'creation-status',
    component: GuestCreationStatusComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: ['employee'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export default class GuestRoutingModule {}
