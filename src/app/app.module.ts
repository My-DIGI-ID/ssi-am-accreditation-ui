import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { TranslationHttpLoader } from './shared/i18n/translation-http-loader';
import AppRoutingModule from './app-routing.module';
import AppComponent from './app.component';
import CoreModule from './core/core.module';
import { environment } from '../environments/environment';
import NgswService from './shared/services/ngsw.service';
import AuthenticationModule from './core/authentication/authentication.module';
import ConfigInitService from './init/config-init.service';

export function HttpLoaderFactory(http: HttpClient, configServie: ConfigInitService) {
  return new TranslationHttpLoader(http, configServie);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, ConfigInitService],
      },
    }),
    CoreModule,
    AuthenticationModule,
  ],
  providers: [NgswService, TranslatePipe],
  bootstrap: [AppComponent],
})
export default class AppModule {}
