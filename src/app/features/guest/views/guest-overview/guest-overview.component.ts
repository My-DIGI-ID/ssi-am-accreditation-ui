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

  public constructor(
    private dialog: MatDialog,
    private readonly store: GuestDashboardStoreService,
    private readonly router: Router,
    private readonly translate: TranslateService
  ) {}

  public ngOnInit(): void {
    this.subscribe();
    this.init();
  }

  public goToAddGuest(): void {
    this.router.navigateByUrl('guest/add');
  }

  public goToEditGuest(id: string): void {
    this.router.navigate(['guest/', id, 'edit']);
  }

  public reloadPage() {
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  }

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

  public downloadEmail(id: string): void {
    this.dynamicDownload(id);
  }

  public dynamicDownload(id) {
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

  private init(): void {
    this.store.init();
  }

  private subscribe(): void {
    this.viewData$ = this.store.connect();

    this.viewData$.subscribe((guests: GuestDashboardViewModel[]) => {
      this.dataSource = new MatTableDataSource(this.statusTransalation(guests));
      this.dataSource.sort = this.sort;
    });
  }

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

  private deleteGuestByAccreditationId(accreditationId: string): void {
    try {
      this.store.deleteGuestByAccreditationId(accreditationId);
    } catch (error) {
      console.log(error);
    }
  }

  private deleteGuestByPartyId(partyId: string): void {
    try {
      this.store.deleteGuestByPartyId(partyId);
      this.reloadPage();
    } catch (error) {
      console.log(error);
    }
  }
}
