/* eslint-disable class-methods-use-this */
import { Component, OnInit, ViewChild } from '@angular/core';
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

  public constructor(private dialog: MatDialog, private readonly store: GuestDashboardStoreService) {}

  public ngOnInit(): void {
    this.subscribe();
    this.init();
  }

  private init(): void {
    this.store.init();
  }

  private subscribe(): void {
    this.viewData$ = this.store.connect();

    this.viewData$.subscribe((guests: GuestDashboardViewModel[]) => {
      this.dataSource = new MatTableDataSource(guests);
      this.dataSource.sort = this.sort;
    });
  }

  public editGuest(id: string): void {
    console.log(id);
  }

  public openDeleteGuestDialog(id: string): void {
    this.dialogConfirmRef = this.dialog.open(DialogComponent, {
      width: '30%',
      data: {
        guestId: id,
        title: 'Löschen',
        discription:
          'Sind Sie sicher, dass sie diesen digitalen Gästeausweis löschen wollen? Dies kann nicht Rückgängig gemacht werden.',
        firstButtonText: 'ABBRECHEN',
        secondButtonText: 'GAST LÖSCHEN',
      },
      autoFocus: false,
    });
    this.dialogConfirmRef.afterClosed().subscribe((affirmativeAction) => {
      if (affirmativeAction === 'second') {
        this.deleteGuest(id);
      }
    });
  }

  public downloadEmail(id: string): void {
    this.dynamicDownloadJson(id);
  }

  public dynamicDownloadJson(id) {
    this.store.downloadEmail(id).subscribe((res) => {
      this.dyanmicDownloadByHtmlTag({
        fileName: 'email-invitation.html',
        text: JSON.stringify(res.invitationEmail).replace(/\\/g, ''),
      });
    });
  }

  private dyanmicDownloadByHtmlTag(arg: { fileName: string; text: string }) {
    const link = document.createElement('a');
    const element = link;

    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    const event = new MouseEvent('click');
    element.dispatchEvent(event);
  }

  private deleteGuest(id: string): void {
    try {
      this.store.deleteGuest(id);
    } catch (error) {
      console.log(error);
    }
  }
}
