/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import EmployeeDashboardViewModel from '../../models/employee-dashboard-view.model';
import EmployeeDashboardStoreService from '../../services/stores/employee-dashboard.store.service';

@Component({
  selector: 'app-employee-overview',
  templateUrl: './employee-overview.component.html',
  styleUrls: ['./employee-overview.component.scss'],
})
export class EmployeeOverviewComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: false })
  private paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true })
  private sort!: MatSort;

  @ViewChild('searchBar')
  public searchBar: ElementRef;

  public dataSource = new MatTableDataSource<EmployeeDashboardViewModel>();

  public displayedColumns: string[] = ['referenceNumber', 'firstName', 'lastName', 'location', 'status', 'actionMenu'];

  public activeTab: number = 0;

  public sum = {
    OPEN: 0,
    PENDING: 0,
    ACCEPTED: 0,
    CANCELLED: 0,
    REVOKED: 0,
    EMPTY: 0,
  };

  public viewData$: Observable<EmployeeDashboardViewModel[]> | undefined;

  public searchValue: string = '';

  public dataSourceLength!: number;

  public searchText = '';

  public hideSearchRow: boolean = false;

  public dialogConfirmRef;

  public constructor(
    private readonly router: Router,
    private readonly store: EmployeeDashboardStoreService,
    private dialog: MatDialog,
    private readonly translate: TranslateService
  ) {}

  public ngOnInit(): void {
    this.init();
    this.subscribe();
  }

  public openSearch() {
    this.hideSearchRow = true;
  }

  public searchClose() {
    this.searchText = '';
    this.hideSearchRow = false;
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(event: any): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchValue = filterValue;

    this.refreshPage();
  }

  public goToEmployeeDetails(id: string): void {
    this.router.navigate(['employee/detail/', id]);
  }

  public goToAddEmployee(): void {
    this.router.navigateByUrl('employee/add-employee');
  }

  public tabClick(e: any) {
    if (e.index === 0 || e.index === 1 || e.index === 2) {
      this.activeTab = e.index;
    }

    this.refreshPage();
  }

  public downloadEmployeeEmailInvitation(id: string): void {
    this.dynamicDownload(id);
  }

  public openDeleteEmployeeDialog(accreditationId: string): void {
    this.dialogConfirmRef = this.dialog.open(DialogComponent, {
      width: '40%',
      data: {
        title: this.translate.instant('employee.employee-overview-component.delete-employee-dialog.title'),
        discription: this.translate.instant('employee.employee-overview-component.delete-employee-dialog.discription'),
        firstButtonText: this.translate.instant(
          'employee.employee-overview-component.delete-employee-dialog.firstButtonText'
        ),
        secondButtonText: this.translate.instant(
          'employee.employee-overview-component.delete-employee-dialog.secondButtonText'
        ),
      },
      autoFocus: false,
    });
    this.dialogConfirmRef.afterClosed().subscribe((affirmativeAction) => {
      if (affirmativeAction === 'second') {
        this.revokeEmployee(accreditationId);
      }
    });
  }

  private revokeEmployee(accreditationId: string): void {
    this.store.deleteEmployee(accreditationId);
  }

  public ngOnDestroy(): void {
    this.searchValue = '';
    this.store.reset();
  }

  private init(): void {
    this.store.init();
  }

  private subscribe(): void {
    this.viewData$ = this.store.connect();

    this.viewData$.subscribe(() => {
      this.refreshPage();
    });
  }

  private refreshPage(): void {
    if (this.activeTab === 0) {
      this.filterTable(0);
    } else if (this.activeTab === 1) {
      this.filterTable(1);
    } else if (this.activeTab === 2) {
      this.filterTable(2);
    }

    this.getStatusNumber();
  }

  private getStatusNumber(): void {
    this.viewData$?.subscribe((employees: EmployeeDashboardViewModel[]) => {
      const keys = Object.keys(this.sum);

      keys.forEach((key) => {
        this.sum[key] = 0;
      });
      employees.map((employee) => {
        if (employee.status === '') {
          this.sum.EMPTY += 1;
        } else {
          this.sum[employee.status] += 1;
        }
        return employee;
      });
    });
  }

  private filterTable(tab: number) {
    if (tab === 0) {
      this.viewData$?.subscribe((employees: EmployeeDashboardViewModel[]) => {
        const filteredEmployees = employees.filter(
          (item) => item.status === 'OPEN' || item.status === 'PENDING' || item.status === ''
        );
        this.dataSource = new MatTableDataSource(filteredEmployees);
      });
    } else if (tab === 1) {
      this.viewData$?.subscribe((employees: EmployeeDashboardViewModel[]) => {
        const filteredEmployees = employees.filter((item) => item.status === 'ACCEPTED');
        this.dataSource = new MatTableDataSource(filteredEmployees);
      });
    } else {
      this.viewData$?.subscribe((employees: EmployeeDashboardViewModel[]) => {
        this.dataSource = new MatTableDataSource(employees);
      });
    }

    if (this.searchValue.length > 0) {
      this.dataSource.filter = this.searchValue.trim().toLowerCase();
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private dynamicDownload(id: string): void {
    this.store.downloadEmail(id).subscribe((payload: any) => {
      const file = new Blob([payload.body], { type: 'messages/rfc822' });
      const filename = `${id}-invitation.eml`;
      this.dynamicDownloadEMLFile(file, filename);
    });
  }

  private dynamicDownloadEMLFile(file: Blob, filename: string): void {
    const url = window.URL.createObjectURL(file);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;

    link.click();
    window.URL.revokeObjectURL(url);

    this.reloadPage();
  }

  public reloadPage() {
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  }
}
