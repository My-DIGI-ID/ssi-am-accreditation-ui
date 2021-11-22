import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import GuestDashboardStoreService from '../../services/stores/guest-dashboard-store.service';
import GuestOverviewComponent from './guest-overview.component';
import NgswService from '../../../../shared/services/ngsw.service';

class StoreMock {
  connect = jasmine.createSpy().and.returnValue(
    of([
      {
        id: 'id-1',
        firstName: 'Ana',
        lastName: 'Pear',
        arriving: '12-12-1900',
        leaving: '12-13-2021',
        email: 'ana@ibm.com',
        location: 'Spain',
      },
      {
        id: 'id-2',
        firstName: 'Ana',
        lastName: 'Pear',
        arriving: '12-12-1900',
        leaving: '12-13-2021',
        email: 'ana@ibm.com',
        location: 'Spain',
      },
      {
        id: 'id-3',
        firstName: 'Ana',
        lastName: 'Pear',
        arriving: '12-12-1900',
        leaving: '12-13-2021',
        email: 'ana@ibm.com',
        location: 'Spain',
      },
    ])
  );

  init = jasmine.createSpy();

  getGuests = jasmine.createSpy();

  addGuest = jasmine.createSpy();

  deleteGuest = jasmine.createSpy();

  downloadEmail = jasmine.createSpy().and.returnValue(
    of({
      invitationEmail: `<!DOCTYPE html> <html lang='en'>  <head>     <title>Invitation</title>     <meta content='text/html; charset=UTF-8' http-equiv='Content-Type'/> </head>  <body> <p>Please scan the following QR-Code to accept the invitation. </p> </body> </html>`,
    })
  );
}
describe('GuestOverviewComponent', () => {
  let store: GuestDashboardStoreService;
  let component: GuestOverviewComponent;
  let fixture: ComponentFixture<GuestOverviewComponent>;
  let dialog: MatDialog;
  let router: Router;

  beforeEach(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    await TestBed.configureTestingModule({
      declarations: [GuestOverviewComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        BrowserAnimationsModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
        TranslateModule.forRoot(),
      ],
      providers: [
        NgswService,
        TranslateService,
        {
          provide: GuestDashboardStoreService,
          useClass: StoreMock,
        },
        { provide: MatDialog, useValue: { open: () => of({ guestId: 1 }) } },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(GuestDashboardStoreService);
    dialog = TestBed.inject(MatDialog);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(GuestOverviewComponent);
    component = fixture.componentInstance;
    spyOn(component, 'reloadPage').and.returnValue();

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('If I call the downloadEmail function the GuestDashboardStoreService should be called', () => {
    component.downloadEmail('id-123');
    fixture.detectChanges();

    expect(store.downloadEmail).toHaveBeenCalled();
  });

  it('If I call the deleteGuest function the GuestDashboardStoreService should be called', () => {
    // eslint-disable-next-line dot-notation
    component['deleteGuest']('id-123');
    fixture.detectChanges();

    expect(store.deleteGuest).toHaveBeenCalled();
  });

  it('If I call editGuest function the log should be called', () => {
    component.goToEditGuest('id-123');
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['guest/', 'id-123', 'edit']);
  });

  it('If I call the openDeleteGuestDialog function the dialog shpuld be open', () => {
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({ id: 1 }) } as MatDialogRef<
      typeof GuestOverviewComponent
    >);
    component.openDeleteGuestDialog('id-1');
    fixture.detectChanges();

    expect(dialog.open).toHaveBeenCalled();
  });

  it('if openDeleteGuestDialog function is called and affirmativeAction is second, deleteGuest should be called', () => {
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of('second') } as MatDialogRef<
      typeof GuestOverviewComponent
    >);

    const deleteGuestSpy = spyOn<any>(component, 'deleteGuest');

    component.openDeleteGuestDialog('id-1');

    expect(deleteGuestSpy).toHaveBeenCalledTimes(1);
  });
});
