import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GuestFormComponent } from '../../forms/guest-form/guest-form.component';
import GuestAddComponent from './guest-add.component';

describe('GuestAddComponent', () => {
  let component: GuestAddComponent;
  let fixture: ComponentFixture<GuestAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestAddComponent, GuestFormComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        TranslateModule.forRoot(),
      ],
      providers: [TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestAddComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it(`if I call the 'go to dashboard' method, I should be taken to the add dashboard page`, () => {
    const routerSpy = spyOn(component['router'], 'navigateByUrl');
    component.goToDashboard();

    expect(routerSpy).toHaveBeenCalledOnceWith('guest');
  });
});
