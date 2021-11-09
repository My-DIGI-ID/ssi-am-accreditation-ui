import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RouterPath } from './shared/enums/router-path';
import { UserRole } from './shared/enums/user-role';
import AuthenticationService from './core/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export default class AppComponent implements OnInit {
  defaultLang: string = 'de';

  public constructor(
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.translateService.use(this.defaultLang);
    // redirect based upon roles in keycloak
    let userRoles: Array<string>;
    this.authService.isLoggedIn().then((userIsLoggedIn: boolean) => {
      if (userIsLoggedIn) {
        userRoles = this.authService.getRoles();
        let routerPath: RouterPath = RouterPath.GUEST;

        userRoles.some((userRole) => {
          switch (userRole) {
            case UserRole.HR_ADMIN:
              routerPath = RouterPath.EMPLOYEE;
              break;
            default:
              return false;
          }
          return true;
        });
        this.router.navigate([routerPath]).catch((e) => console.debug(e));
      }
    });
  }
}
