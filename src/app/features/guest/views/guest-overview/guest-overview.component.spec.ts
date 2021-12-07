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
import GuestDashboardViewModel from 'features/guest/models/guest-dashboard-view.model';

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

  deleteGuestByAccreditationId = jasmine.createSpy();

  deleteGuestByPartyId = jasmine.createSpy();

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
  let translate: TranslateService;

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
    translate = fixture.debugElement.injector.get(TranslateService);
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

  it('If I call the deleteGuestByAccreditationId function the GuestDashboardStoreService should be called', () => {
    // eslint-disable-next-line dot-notation
    component['deleteGuestByAccreditationId']('id-123');
    fixture.detectChanges();

    expect(store.deleteGuestByAccreditationId).toHaveBeenCalled();
  });

  it('If I call the deleteGuestByPartyId function the GuestDashboardStoreService should be called', () => {
    // eslint-disable-next-line dot-notation
    component['deleteGuestByPartyId']('id-123');
    fixture.detectChanges();

    expect(store.deleteGuestByPartyId).toHaveBeenCalled();
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

  it('if openDeleteGuestDialog function is called with existing accreditationId and affirmativeAction is second, deleteGuestByAccreditationId should be called', () => {
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of('second') } as MatDialogRef<
      typeof GuestOverviewComponent
    >);

    const deleteGuestSpy = spyOn<any>(component, 'deleteGuestByAccreditationId');
    const guest = {
      accreditationId: 'id-1',
    };
    component.openDeleteGuestDialog(guest);

    expect(deleteGuestSpy).toHaveBeenCalledTimes(1);
  });

  it('if openDeleteGuestDialog function is called without exicting accreditationId and affirmativeAction is second, deleteGuestByPartyId should be called', () => {
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of('second') } as MatDialogRef<
      typeof GuestOverviewComponent
    >);

    const deleteGuestSpy = spyOn<any>(component, 'deleteGuestByPartyId');
    const guest = {
      accreditationId: '',
    };
    component.openDeleteGuestDialog(guest);

    expect(deleteGuestSpy).toHaveBeenCalledTimes(1);
  });

  describe('if we call the statusTransalation function with', () => {
    let guests: GuestDashboardViewModel[];
    beforeEach(() => {
      const guestsDashboardViewM: GuestDashboardViewModel[] = [
        {
          id: '0',
          firstName: 'Gizi',
          lastName: 'Doe',
          arriving: '',
          leaving: '',
          email: 'gizi@email.com',
          location: 'Budapest',
          status: 'ACCEPTED',
          accreditationId: '',
        },
        {
          id: '1',
          firstName: 'Gizi',
          lastName: 'Doe',
          arriving: '',
          leaving: '',
          email: 'gizi@email.com',
          location: 'Budapest',
          status: 'PENDING',
          accreditationId: '',
        },
        {
          id: '2',
          firstName: 'Gizi',
          lastName: 'Doe',
          arriving: '',
          leaving: '',
          email: 'gizi@email.com',
          location: 'Budapest',
          status: 'CANCELLED',
          accreditationId: '',
        },
        {
          id: '3',
          firstName: 'Gizi',
          lastName: 'Doe',
          arriving: '',
          leaving: '',
          email: 'gizi@email.com',
          location: 'Budapest',
          status: 'CHECK_IN',
          accreditationId: '',
        },
        {
          id: '4',
          firstName: 'Gizi',
          lastName: 'Doe',
          arriving: '',
          leaving: '',
          email: 'gizi@email.com',
          location: 'Budapest',
          status: 'CHECK_OUT',
          accreditationId: '',
        },
      ];

      // eslint-disable-next-line dot-notation
      guests = component['statusTransalation'](guestsDashboardViewM);
      fixture.detectChanges();
    });

    it('ACCEPTED status, it should return with the proper transalation', () => {
      const acceptedStatus = translate.instant('guest.guest-overview-component.guest-status.accepted');

      expect(guests[0].status).toEqual(acceptedStatus);
    });

    it('PENDING status, it should return with the proper transalation', () => {
      const pendingStatus = translate.instant('guest.guest-overview-component.guest-status.pending');

      expect(guests[1].status).toEqual(pendingStatus);
    });

    it('CANCELLED status, it should return with the proper transalation', () => {
      const cancelledStatus = translate.instant('guest.guest-overview-component.guest-status.cancelled');

      expect(guests[2].status).toEqual(cancelledStatus);
    });

    it('CHECK_IN status, it should return with the proper transalation', () => {
      const checkInStatus = translate.instant('guest.guest-overview-component.guest-status.check-in');

      expect(guests[3].status).toEqual(checkInStatus);
    });

    it('CHECK_OUT status, it should return with the proper transalation', () => {
      const checkOutStatus = translate.instant('guest.guest-overview-component.guest-status.check-out');

      expect(guests[4].status).toEqual(checkOutStatus);
    });
  });
});
