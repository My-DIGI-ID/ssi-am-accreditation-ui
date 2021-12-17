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

/**
 * Class representing the EmployeeOverviewComponent
 */
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

  /**
   * Instantiates the EmployeeOverviewComponent.
   * @param {Router} router - A service that provides navigation among views and URL manipulation capabilities.
   * @param {EmployeeDashboardStoreService} store - employee dashboard store - holds functions related to employee dashboard
   * @param {MatDialog} dialog - Modal dialog service from Angular Material
   * @param {TranslateService} translate - The internationalisation service
   */
  public constructor(
    private readonly router: Router,
    private readonly store: EmployeeDashboardStoreService,
    private dialog: MatDialog,
    private readonly translate: TranslateService
  ) {}

  /**
   * Initialising function that initialises the employee dashboard store and connects to it to retrieve data
   */
  public ngOnInit(): void {
    this.init();
    this.subscribe();
  }

  /**
   * Hides the search row
   */
  public openSearch() {
    this.hideSearchRow = true;
  }

  /**
   * Sets the search term to an empty string and shows the search row
   */
  public searchClose() {
    this.searchText = '';
    this.hideSearchRow = false;
  }

  /**
   * Sets the pagination and the sorting of the data
   */
  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Applies the search filter and refreshes the page
   * @param {any} event - event
   */
  public applyFilter(event: any): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchValue = filterValue;

    this.refreshPage();
  }

  /**
   * Navigates to the employee/detail/ page corresponding to the employee whose ID was given
   * @param {string} id - employee id
   */
  public goToEmployeeDetails(id: string): void {
    this.router.navigate(['employee/detail/', id]);
  }

  /**
   * Navigates to the employee/add-employee page
   */
  public goToAddEmployee(): void {
    this.router.navigateByUrl('employee/add-employee');
  }

  /**
   * Handler for clicking on tabs, sets the tab to the one that is clicked and refreshes the page
   * @param {any} e - event
   */
  public tabClick(e: any) {
    if (e.index === 0 || e.index === 1 || e.index === 2) {
      this.activeTab = e.index;
    }

    this.refreshPage();
  }

  /**
   * Downloads email invitation for the given employee ID
   * @param {string} id - event
   */
  public downloadEmployeeEmailInvitation(id: string): void {
    this.dynamicDownload(id);
  }

  /**
   * Opens a modal that prompts the user to delete the employee with the given accreditation ID.
   * If the user selects the affirmative response, the employee will be revoked.
   * @param {string} accreditationId - accreditation id
   */
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

  /**
   * Reloads page
   */
  public reloadPage(): void {
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  }

  private revokeEmployee(accreditationId: string): void {
    this.store.deleteEmployee(accreditationId);
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

  /**
   * When the page is destroyed, the search value is set to an empty string and the store is reset
   */
  public ngOnDestroy(): void {
    this.searchValue = '';
    this.store.reset();
  }
}
