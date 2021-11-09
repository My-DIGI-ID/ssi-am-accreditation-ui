import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatToolbarHarness } from '@angular/material/toolbar/testing';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import HeaderComponent from './header.component';

const keycloakServiceMock = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: (): void => {},
  loadUserProfile: (): Promise<KeycloakProfile> =>
    new Promise((resolve) => {
      resolve({});
    }),
  getUsername: (): string => 'mock keycloak user',
  isLoggedIn: (): Promise<boolean> =>
    new Promise((resolve) => {
      resolve(true);
    }),
};
describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [MatToolbarModule, TranslateModule.forRoot()],
      providers: [{ provide: KeycloakService, useValue: keycloakServiceMock }, TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('should have an instance of mat-toolbar', async () => {
    const toolbar = await loader.getAllHarnesses(MatToolbarHarness);

    expect(toolbar.length).toBe(1);
  });

  it('if I call the logout function the keycloak service is also called', async () => {
    const keycloakServiceLogoutSpy = spyOn(keycloakServiceMock, 'logout').and.callThrough();
    component.logout();

    expect(keycloakServiceLogoutSpy).toHaveBeenCalledTimes(1);
  });

  it('if I call the loadUserProfile function the keycloak service is also called', async () => {
    const keycloakServiceLoadUserProfileSpy = spyOn(keycloakServiceMock, 'loadUserProfile').and.callThrough();
    // eslint-disable-next-line dot-notation
    component['loadUserProfile']();

    expect(keycloakServiceLoadUserProfileSpy).toHaveBeenCalledTimes(1);
  });
});
