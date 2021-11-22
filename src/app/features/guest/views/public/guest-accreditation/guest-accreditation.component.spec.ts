import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of, Subject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import GuestStoreService from '../../../services/stores/guest-store.service';
import { GuestAccreditationComponent } from './guest-accreditation.component';
import { VisitAndGuestDetailsComponent } from './visit-and-guest-details/visit-and-guest-details.component';
import { VerificationComponent } from './verification/verification.component';

class StoreMock {
  credentialsOffered: Subject<boolean> = new Subject();

  $credentialsOfferedObservable = new Observable((subscribe) => {
    subscribe.next();
  });

  init = jasmine.createSpy();

  getQRCode = jasmine.createSpy().and.returnValue(of('some string'));

  pollBasisIdProcessing = jasmine.createSpy().and.returnValue(of('some string'));

  getGuestByAccreditationId = jasmine.createSpy().and.returnValue(
    of([
      {
        creationDate: '',
        firstName: 'Test1',
        lastName: 'Dummy',
        location: 'London, BakerStreet',
        referenceNumber: 'ref-1',
        status: '',
      },
    ])
  );
}

describe('GuestAccreditationComponent', () => {
  let component: GuestAccreditationComponent;
  let guestStoreService: GuestStoreService;
  let fixture: ComponentFixture<GuestAccreditationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestAccreditationComponent, VerificationComponent, VisitAndGuestDetailsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatCheckboxModule,
        MatInputModule,
        MatFormFieldModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        TranslateService,
        {
          provide: GuestStoreService,
          useClass: StoreMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(GuestAccreditationComponent);
        component = fixture.componentInstance;
        guestStoreService = TestBed.inject(GuestStoreService);
        fixture.detectChanges();
      });
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  describe('if the function onQRCodeIsScanned is called', () => {
    let getGuestDTOSpy: jasmine.Spy;
    let goSecondPageSpy: jasmine.Spy;
    let isScanned: boolean;

    it('if I call goSecondPage, activeStepNumber should be set to 2', () => {
      component.activeStepNumber = 1;
      component.goSecondPage();

      fixture.detectChanges();
      expect(component.activeStepNumber).toEqual(2);
    });

    describe('with true as parameter', () => {
      beforeEach(() => {
        component.activeStepNumber = 1;

        isScanned = true;
        getGuestDTOSpy = spyOn<any>(component, 'getGuestDTO').and.callThrough();
        goSecondPageSpy = spyOn(component, 'goSecondPage').and.callThrough();

        component.onQRCodeIsScanned(isScanned);
        fixture.detectChanges();
      });

      it('the function goSecondPage should be called', () => {
        expect(goSecondPageSpy).toHaveBeenCalledTimes(1);
      });

      it('the active step number should be 2', () => {
        expect(component.activeStepNumber).toEqual(2);
      });

      it('the first step should be done', () => {
        expect(component.stepOneDone).toEqual(true);
      });

      it('the function getGuestDTO should be called', () => {
        expect(getGuestDTOSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('with false as parameter', () => {
      beforeEach(() => {
        isScanned = false;
        getGuestDTOSpy = spyOn<any>(component, 'getGuestDTO').and.callThrough();
        goSecondPageSpy = spyOn(component, 'goSecondPage').and.callThrough();

        component.onQRCodeIsScanned(isScanned);
        fixture.detectChanges();
      });

      it('the active step number should be 1', () => {
        expect(component.activeStepNumber).toEqual(1);
      });

      it('the first step should not be done', () => {
        expect(component.stepOneDone).toEqual(false);
      });

      it('the function getGuestDTO should not be called', () => {
        expect(getGuestDTOSpy).toHaveBeenCalledTimes(0);
      });

      it('the function goSecondPage should not be called', () => {
        expect(goSecondPageSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  it('if ngOnInit is triggered, subscribe should be called', fakeAsync(() => {
    const subscribeSpy = spyOn(guestStoreService.$credentialsOfferedObservable, 'subscribe').and.callThrough();

    component.ngOnInit();

    tick();

    expect(subscribeSpy).toHaveBeenCalled();
  }));

  it('if ngOnInit is triggered, the accreditation should be accepted', fakeAsync(() => {
    spyOn(guestStoreService.$credentialsOfferedObservable, 'subscribe').and.callThrough();

    component.ngOnInit();

    tick();

    expect(component.accreditationAccepted).toEqual(true);
  }));

  describe('submitGuestDetails is called', () => {
    let createGuestExtendedDTOSpy: any;

    beforeEach(() => {
      createGuestExtendedDTOSpy = spyOn<any>(component, 'createGuestExtendedDTO');
    });

    describe('if the guestform is invalid', () => {
      it('createGuestExtendedDTO function should not be called', () => {
        component.activeStepNumber = 2;
        fixture.detectChanges();

        component.submitGuestDetails();

        expect(createGuestExtendedDTOSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe('if the guestform is valid', () => {
      beforeEach(() => {
        component.activeStepNumber = 2;
        fixture.detectChanges();
        const visitAndGuestDetailsComponent = fixture.debugElement.query(
          By.directive(VisitAndGuestDetailsComponent)
        ).componentInstance;
        visitAndGuestDetailsComponent.guestForm = visitAndGuestDetailsComponent.createGuestForm();
        visitAndGuestDetailsComponent.guestForm.controls.companyStreet.setValue('Zuiderdiep 25');
        visitAndGuestDetailsComponent.guestForm.controls.companyCity.setValue('Groningen');
        visitAndGuestDetailsComponent.guestForm.controls.companyPostCode.setValue('1234qw');
        visitAndGuestDetailsComponent.populateGuestForm({
          id: '123',
          firstName: 'Max',
          lastName: 'Green',
          email: 'max.green@ibm.com',
          companyName: 'ibm',
          typeOfVisit: 'business',
          location: 'Groningen',
          primaryPhoneNumber: '0031612345678',
          secondaryPhoneNumber: '0031612345679',
          validFromDate: 'Wed Dec 12 2012 01:00:00 GMT+0100 (Central European Standard Time)',
          validFromTime: '11:11:00',
          validUntilDate: '12-12-2023',
          validUntilTime: '11:11:00',
        });
      });

      it('createGuestExtendedDTO function should be called', async () => {
        component.submitGuestDetails();

        expect(createGuestExtendedDTOSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  it('i1', () => {
    const getGuestDTOSpy = spyOn<any>(component, 'getGuestDTO').and.callThrough();
    component.onQRCodeIsScanned(true);
    fixture.detectChanges();

    expect(component.activeStepNumber).toEqual(2);
    expect(component.stepOneDone).toEqual(true);
    expect(getGuestDTOSpy).toHaveBeenCalledTimes(1);
  });
});
