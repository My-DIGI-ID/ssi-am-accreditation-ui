import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmployeeOverviewComponent } from './employee-overview.component';
import EmployeeDashboardStoreService from '../../services/stores/employee-dashboard.store.service';

class StoreMock {
  init = jasmine.createSpy();

  connect = jasmine.createSpy().and.returnValue(
    of([
      {
        creationDate: '',
        firstName: 'Test1',
        lastName: 'Dummy',
        location: 'London, BakerStreet',
        referenceNumber: 'ref-1',
        status: '',
      },
      {
        creationDate: '',
        firstName: 'Test2',
        lastName: 'Dummy',
        location: 'Texas, BakerStreet',
        referenceNumber: 'ref-2',
        status: 'OPEN',
      },
      {
        creationDate: '',
        firstName: 'Test3',
        lastName: 'Dummy',
        location: 'Paris, BakerStreet',
        referenceNumber: 'ref-3',
        status: 'ACCEPTED',
      },
    ])
  );

  getEmployeesAccreditation = jasmine.createSpy();

  downloadEmail = jasmine.createSpy().and.returnValue(
    of({
      invitationEmail: `<!DOCTYPE html> <html lang='en'>  <head>     <title>Invitation</title>     <meta content='text/html; charset=UTF-8' http-equiv='Content-Type'/> </head>  <body> <p>Please scan the following QR-Code to accept the invitation. </p> </body> </html>`,
    })
  );

  dispatch = jasmine.createSpy();
}

describe('EmployeeOverviewComponent', () => {
  let component: EmployeeOverviewComponent;
  let fixture: ComponentFixture<EmployeeOverviewComponent>;
  let store: EmployeeDashboardStoreService;
  let router: Router;

  beforeEach(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    await TestBed.configureTestingModule({
      declarations: [EmployeeOverviewComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatIconModule,
        MatPaginatorModule,
        MatTabsModule,
        MatTableModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        TranslateService,
        {
          provide: EmployeeDashboardStoreService,
          useClass: StoreMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeOverviewComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    store = TestBed.inject(EmployeeDashboardStoreService);

    fixture.detectChanges();
  });

  describe('if the page is successfully created', () => {
    it('the instance should be successfully created', () => {
      expect(component).toBeTruthy();
    });

    it('I should get the ACCEPTED numbers correctly', () => {
      expect(component.sum.ACCEPTED).toEqual(1);
    });

    it('I should get the CANCELLED numbers correctly', () => {
      expect(component.sum.CANCELLED).toEqual(0);
    });

    it('I should get the EMPTY numbers correctly', () => {
      expect(component.sum.EMPTY).toEqual(1);
    });

    it('I should get the OPEN numbers correctly', () => {
      expect(component.sum.OPEN).toEqual(1);
    });

    it('I should get the PENDING numbers correctly', () => {
      expect(component.sum.PENDING).toEqual(0);
    });

    it('I should get the REVOKED numbers correctly', () => {
      expect(component.sum.REVOKED).toEqual(0);
    });
  });

  it(`if I call the 'applyFilter' function, the dataSource filter should be the same`, () => {
    const event = { target: { value: 'ASDFGHJKL' } } as any;
    component.applyFilter(event);
    fixture.detectChanges();

    expect(component.dataSource.filter).toEqual('asdfghjkl');
  });

  describe(`if I call the 'filterTable' function`, () => {
    it(`with 0 in the mocking data, the data length should be two`, () => {
      // eslint-disable-next-line dot-notation
      component['filterTable'](0);
      fixture.detectChanges();

      expect(component.dataSource.data.length).toEqual(2);
    });

    it('with 1 in the mocking data, the data length should be one', () => {
      // eslint-disable-next-line dot-notation
      component['filterTable'](1);
      fixture.detectChanges();

      expect(component.dataSource.data.length).toEqual(1);
    });

    it('with 2 in the mocking data, the data length should be three', () => {
      // eslint-disable-next-line dot-notation
      component['filterTable'](2);
      fixture.detectChanges();

      expect(component.dataSource.data.length).toEqual(3);
    });
  });

  it('if I call the tabClick function with 0 index, the activeTab should be 0', () => {
    const e = { index: 0 };
    component.tabClick(e);
    fixture.detectChanges();

    expect(component.activeTab).toEqual(0);
  });

  it('if I call the tabClick function with 1 index, the activeTab should be 2', () => {
    const e = { index: 1 };
    component.tabClick(e);
    fixture.detectChanges();

    expect(component.activeTab).toEqual(1);
  });

  it('if I call the tabClick function with 2 index, the activeTab should be 2', () => {
    const e = { index: 2 };
    component.tabClick(e);
    fixture.detectChanges();

    expect(component.activeTab).toEqual(2);
  });

  it('if I call the downloadEmployeeEmailInvitation function, the dynamicDownloadJson function should be called', () => {
    const dynamicDownloadJsonSpy = spyOn<any>(component, 'dynamicDownloadJson');
    component.downloadEmployeeEmailInvitation('123-id');
    fixture.detectChanges();

    expect(dynamicDownloadJsonSpy).toHaveBeenCalled();
  });

  it(`if I call the 'go to employee detail' method with '123' parameter, I should be taken to the the employee detail page with the correct parameter`, () => {
    component.goToEmployeeDetails('123');

    expect(router.navigate).toHaveBeenCalledWith(['employee/detail/', '123']);
  });

  it(`if I call the 'go to add employee' method, I should be taken to the add employee page`, () => {
    component.goToAddEmployee();

    expect(router.navigateByUrl).toHaveBeenCalledWith('employee/add-employee');
  });

  it('If I call the dynamicDownloadJson function, the EmployeeDashboardStoreService should be called', () => {
    // eslint-disable-next-line dot-notation
    component['dynamicDownloadJson']('id-123');
    fixture.detectChanges();

    expect(store.downloadEmail).toHaveBeenCalled();
  });
});