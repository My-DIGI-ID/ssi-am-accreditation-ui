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
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import GuestDashboardViewModel from '../../models/guest-dashboard-view.model';
import GuestDashboardStoreService from '../../services/stores/guest-dashboard-store.service';

/**
 * Class representing the GuestOverviewComponent
 */
@Component({
  selector: 'app-guest-overview',
  templateUrl: './guest-overview.component.html',
  styleUrls: ['./guest-overview.component.scss'],
})
export default class GuestOverviewComponent implements OnInit {
  @ViewChild(MatSort, { static: false })
  public sort: MatSort;

  public viewData$: Observable<GuestDashboardViewModel[]> | undefined;

  public dataSource: any = [];

  public displayedColumns: string[] = [
    'firstName',
    'lastName',
    'arriving',
    'leaving',
    'email',
    'location',
    'status',
    'edit',
  ];

  public dialogConfirmRef;

  /**
   * Instantiates the GuestOverviewComponent
   * @param {MatDialog} dialog - Modal dialog service from Angular Material
   * @param {GuestDashboardStoreService} store - The guest dashboard store
   * @param {Router} router - A service that provides navigation among views and URL manipulation capabilities.
   * @param {TranslateService} translate - Internationalisation service
   */
  public constructor(
    private dialog: MatDialog,
    private readonly store: GuestDashboardStoreService,
    private readonly router: Router,
    private readonly translate: TranslateService
  ) {}

  /**
   * Initialisation function that subscribes to the store data and initialises the guest dashboard store
   */
  public ngOnInit(): void {
    this.init();
    this.subscribe();
  }

  /**
   * Navigates to the add guest page
   */
  public goToAddGuest(): void {
    this.router.navigateByUrl('guest/add');
  }

  /**
   * Navigates to the edit guest page, using the guest ID
   * @param {string} id - guest ID
   */
  public goToEditGuest(id: string): void {
    this.router.navigate(['guest/', id, 'edit']);
  }

  /**
   * Refreshes page
   */
  public reloadPage() {
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  }

  /**
   * Opens a modal dialog that prompts the user to delete the guest used as parameter
   * After the dialog is closed, if the answer was affirmative, the guest will be deleted either by
   * accreditationId or id if the accreditationId is not present.
   * @param {any} guest - guest to be deleted
   */
  public openDeleteGuestDialog(guest: any): void {
    this.dialogConfirmRef = this.dialog.open(DialogComponent, {
      width: '30%',
      data: {
        guestId: guest,
        title: this.translate.instant('guest.guest-overview-component.delete-guest-dialog.title'),
        discription: this.translate.instant('guest.guest-overview-component.delete-guest-dialog.discription'),
        firstButtonText: this.translate.instant('guest.guest-overview-component.delete-guest-dialog.firstButtonText'),
        secondButtonText: this.translate.instant('guest.guest-overview-component.delete-guest-dialog.secondButtonText'),
      },
      autoFocus: false,
    });
    this.dialogConfirmRef.afterClosed().subscribe((affirmativeAction) => {
      if (affirmativeAction === 'second') {
        if (guest.accreditationId.length !== 0) {
          this.deleteGuestByAccreditationId(guest.accreditationId);
        } else {
          this.deleteGuestByPartyId(guest.id);
        }
      }
    });
  }

  /**
   * Downloads email based on ID
   * @param {string} id - guest ID
   */
  public downloadEmail(id: string): void {
    this.dynamicDownload(id);
  }

  /**
   * Calls the guest dashboard store function that downloads email based on the guest ID
   * @param {string} id - guest ID
   */
  public dynamicDownload(id: string): void {
    this.store.downloadEmail(id).subscribe((payload: any) => {
      const file = new Blob([payload.body], { type: 'messages/rfc822' });
      const filename = `${id}-invitation.eml`;
      this.dynamicDownloadEMLFile(file, filename);
    });
  }

  /**
   * Downloads EML file with the given file and filename
   * @param {Blob} file - file to download
   * @param {string} filename - file name
   */
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
   * Calls the guest dashboard store function that initialises the store
   */
  private init(): void {
    this.store.init();
  }

  /**
   * Connects to the guest dashboard store, acquires the data and sorts it
   */
  private subscribe(): void {
    this.viewData$ = this.store.connect();

    this.viewData$.subscribe((guests: GuestDashboardViewModel[]) => {
      this.dataSource = new MatTableDataSource(this.statusTransalation(guests));
      this.dataSource.sort = this.sort;
    });
  }

  /**
   * Mapping of the status of the guests
   * @param {GuestDashboardViewModel[]} guests - guests whose status to translate
   * @return {GuestDashboardViewModel[]} guests
   */
  private statusTransalation(guests: GuestDashboardViewModel[]): GuestDashboardViewModel[] {
    guests.map((guest) => {
      if (guest.status === 'ACCEPTED') {
        // eslint-disable-next-line no-param-reassign
        guest.status = this.translate.instant('guest.guest-overview-component.guest-status.accepted');
      } else if (guest.status === 'PENDING') {
        // eslint-disable-next-line no-param-reassign
        guest.status = this.translate.instant('guest.guest-overview-component.guest-status.pending');
      } else if (guest.status === 'CANCELLED') {
        // eslint-disable-next-line no-param-reassign
        guest.status = this.translate.instant('guest.guest-overview-component.guest-status.cancelled');
      } else if (guest.status === 'CHECK_IN') {
        // eslint-disable-next-line no-param-reassign
        guest.status = this.translate.instant('guest.guest-overview-component.guest-status.check-in');
      } else if (guest.status === 'CHECK_OUT') {
        // eslint-disable-next-line no-param-reassign
        guest.status = this.translate.instant('guest.guest-overview-component.guest-status.check-out');
      }
      return guest;
    });
    return guests;
  }

  /**
   * Deletes guest based on their accreditation ID
   * @param {string} accreditationId - guest accreditation ID
   */
  private deleteGuestByAccreditationId(accreditationId: string): void {
    try {
      this.store.deleteGuestByAccreditationId(accreditationId);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Deletes guest based on their party ID
   * @param {string} partyId - guest party ID
   */
  private deleteGuestByPartyId(partyId: string): void {
    try {
      this.store.deleteGuestByPartyId(partyId);
      this.reloadPage();
    } catch (error) {
      console.log(error);
    }

    this.reloadPage();
  }
}
