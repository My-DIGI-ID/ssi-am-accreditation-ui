import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import AuthenticationGuard from '../../core/authentication/authentication.guard';
import GuestAddComponent from './views/guest-add/guest-add.component';
import GuestOverviewComponent from './views/guest-overview/guest-overview.component';
import GuestWelcomeComponent from './views/public/guest-welcome/guest-welcome.component';
import { GuestAccreditationComponent } from './views/public/guest-accreditation/guest-accreditation.component';
import { GuestCreationStatusComponent } from './views/guest-creation-status/guest-creation-status.component';

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
