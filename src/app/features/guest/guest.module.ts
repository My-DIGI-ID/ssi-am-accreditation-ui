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

import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import SharedModule from '../../shared/shared.module';
import AuthenticationModule from '../../core/authentication/authentication.module';
import GuestRoutingModule from './guest-routing.module';
import GuestOverviewComponent from './views/guest-overview/guest-overview.component';
import GuestAddComponent from './views/guest-add/guest-add.component';
import { GuestAccreditationComponent } from './views/public/guest-accreditation/guest-accreditation.component';
import GuestWelcomeComponent from './views/public/guest-welcome/guest-welcome.component';
import { VerificationComponent } from './views/public/guest-accreditation/verification/verification.component';
import { VisitAndGuestDetailsComponent } from './views/public/guest-accreditation/visit-and-guest-details/visit-and-guest-details.component';
import { ConfirmationComponent } from './views/public/guest-accreditation/confirmation/confirmation.component';
import { GuestFormComponent } from './forms/guest-form/guest-form.component';
import { GuestCreationStatusComponent } from './views/guest-creation-status/guest-creation-status.component';
import { GuestDisplayPipe } from '../../shared/utilities/guest-display-time.pipe';
import { GuestEditComponent } from './views/guest-edit/guest-edit.component';

@NgModule({
  declarations: [
    GuestOverviewComponent,
    GuestAddComponent,
    GuestAccreditationComponent,
    GuestWelcomeComponent,
    VerificationComponent,
    VisitAndGuestDetailsComponent,
    ConfirmationComponent,
    GuestFormComponent,
    GuestCreationStatusComponent,
    GuestDisplayPipe,
    GuestEditComponent,
  ],
  imports: [
    CommonModule,
    GuestRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
    SharedModule,
    AuthenticationModule,
  ],
})
export default class GuestModule {}
