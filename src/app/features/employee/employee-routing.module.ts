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
