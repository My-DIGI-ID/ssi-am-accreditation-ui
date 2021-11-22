import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { VisitAndGuestDetailsComponent } from './visit-and-guest-details.component';
import NgswService from '../../../../../../shared/services/ngsw.service';

describe('VisitAndGuestDetailsComponent', () => {
  let component: VisitAndGuestDetailsComponent;
  let fixture: ComponentFixture<VisitAndGuestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisitAndGuestDetailsComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        TranslateModule.forRoot(),
      ],
      providers: [NgswService, TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitAndGuestDetailsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it(`if I call the submit function, the submitForm's emit function should be also called`, () => {
    // eslint-disable-next-line dot-notation
    const submitEmitterSpy = spyOn(component['submitForm'], 'emit');
    component.guestForm.get('firstName')!.setValue('abc');
    component.guestForm.get('lastName')!.setValue('abc');
    component.guestForm.get('title')!.setValue('abc');
    component.guestForm.get('email')!.setValue('abc');
    component.guestForm.get('companyName')!.setValue('abc');
    component.guestForm.get('typeOfVisit')!.setValue('abc');
    component.guestForm.get('location')!.setValue('abc');
    component.guestForm.get('validFromDate')!.setValue('abc');
    component.guestForm.get('validUntilDate')!.setValue('abc');
    component.guestForm.get('validFromTime')!.setValue('abc');
    component.guestForm.get('validUntilTime')!.setValue('abc');
    component.guestForm.get('issuedBy')!.setValue('abc');
    component.submit();
    fixture.detectChanges();

    expect(submitEmitterSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the populateGuestForm function on the guesApiModel, the guestForm.getRawValue() should return with guestFormModel', () => {
    const guestApiModel = {
      id: '',
      firstName: '',
      lastName: '',
      title: '',
      email: '',
      primaryPhoneNumber: '',
      secondaryPhoneNumber: '',
      companyName: '',
      typeOfVisit: '',
      location: '',
      validFrom: '',
      validUntil: '',
      issuedBy: '',
    };

    const guestFormModel = {
      firstName: '',
      lastName: '',
      title: '',
      email: '',
      primaryPhoneNumber: '',
      secondaryPhoneNumber: '',
      companyName: '',
      typeOfVisit: '',
      location: '',
      validFromDate: '',
      validUntilDate: '',
      validFromTime: '',
      validUntilTime: '',
      issuedBy: '',
      companyStreet: '',
      companyCity: '',
      companyPostCode: '',
      licencePlateNumber: '',
    };
    component.populateGuestForm(guestApiModel);
    fixture.detectChanges();

    expect(component.guestForm.getRawValue()).toEqual(guestFormModel);
  });

  it('if I call the getDateFromDTO I should get back the correct date format', () => {
    // eslint-disable-next-line dot-notation
    const date = component['getDateFromDTO']('October 26, 2021 08:12:00');
    fixture.detectChanges();

    expect(date).toEqual('26 Oct 2021');
  });

  it('if I call the getTimeFromDTO I should get back the correct time format', () => {
    // eslint-disable-next-line dot-notation
    const date = component['getTimeFromDTO']('October 26, 2021 10:12:00');
    fixture.detectChanges();

    // TODO: ITS NOT HANDLE 08:00 -> 8:00
    expect(date).toEqual('10:12');
  });

  it('if the ngOnChanges angular hooks activated, the populateGuestForm function should also be called', () => {
    const populateGuestFormSpy = spyOn(component, 'populateGuestForm');
    const guest = {
      id: '',
      firstName: 'Ana',
      lastName: '',
      title: '',
      email: '',
      primaryPhoneNumber: '',
      secondaryPhoneNumber: '',
      companyName: '',
      typeOfVisit: '',
      location: '',
      validFromDate: '',
      validUntilDate: '',
      validFromTime: '',
      validUntilTime: '',
      issuedBy: '',
    };
    component.ngOnChanges({
      guest: new SimpleChange(null, guest, true),
    });
    fixture.detectChanges();

    expect(populateGuestFormSpy).toHaveBeenCalled();
  });
});
