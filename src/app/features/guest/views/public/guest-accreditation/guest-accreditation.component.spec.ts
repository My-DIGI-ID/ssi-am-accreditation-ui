import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, Subject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import GuestStoreService from '../../../services/stores/guest-store.service';
import { GuestAccreditationComponent } from './guest-accreditation.component';
import { VisitAndGuestDetailsComponent } from './visit-and-guest-details/visit-and-guest-details.component';
import { VerificationComponent } from './verification/verification.component';

class StoreMock {
  credentialsOffered: Subject<boolean> = new Subject();

  $credentialsOfferedObservable = this.credentialsOffered.asObservable();

  init = jasmine.createSpy();

  getQRCode = jasmine.createSpy().and.returnValue(of('some string'));

  pollBasisIdProcessing = jasmine.createSpy().and.returnValue(of('some string'));

  getGuestById = jasmine.createSpy().and.returnValue(
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
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestAccreditationComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
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
