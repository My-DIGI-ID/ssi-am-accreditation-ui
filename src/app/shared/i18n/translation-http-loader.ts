import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import ConfigInitService from '../../init/config-init.service';

export class TranslationHttpLoader implements TranslateLoader {
  public constructor(private http: HttpClient, private readonly configServie: ConfigInitService) {}

  public getTranslation(lang: string): Observable<any> {
    return this.http.get<any>(
      `${this.configServie.getConfigStatic().ACCREDITATION_CONTROLLER_BASE_URL}/admin/i18n?languageCode=${lang}`
    );
  }
}
