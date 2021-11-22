import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { GuestFormComponent } from './../../forms/guest-form/guest-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { GuestEditComponent } from './guest-edit.component';

describe('GuestEditComponent', () => {
  let component: GuestEditComponent;
  let fixture: ComponentFixture<GuestEditComponent>;

  beforeEach(async () => {
    const activeRouteMock = {
      snapshot: {
        params: {
          id: '123-id',
        },
      },
    };
    await TestBed.configureTestingModule({
      declarations: [GuestEditComponent, GuestFormComponent],
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
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activeRouteMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
