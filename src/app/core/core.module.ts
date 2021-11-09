import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import AuthenticationInterceptor from './authentication.interceptor';
import ErrorHandlingModule from './error-handling/error-handling.module';
import HeaderComponent from './header/header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, ErrorHandlingModule, MatToolbarModule, TranslateModule.forChild()],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
  ],
  exports: [HeaderComponent],
})
export default class CoreModule {}
