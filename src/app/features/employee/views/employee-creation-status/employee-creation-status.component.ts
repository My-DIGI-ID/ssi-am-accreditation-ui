import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import EmployeeViewModel from '../../models/employee-view.model';

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

  public constructor(public router: Router, private readonly translate: TranslateService) {
    this.navigationState = this.router.getCurrentNavigation();

    this.success = this.navigationState!.extras.state?.success;
    if (this.success) {
      this.employees = this.navigationState!.extras.state?.data;
    } else {
      this.errorMessage = this.navigationState!.extras.state?.data;
    }
  }

  public getHeaderText(): string {
    return this.success ? this.successHeader : this.errorHeader;
  }

  public getStatusText(): string {
    return this.success ? this.successText : this.errorText;
  }

  public goToAddEmployee(): void {
    this.router.navigateByUrl('employee/add-employee');
  }

  public goToDashboard(): void {
    this.router.navigateByUrl('employee/dashboard');
  }
}
