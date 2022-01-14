import { HttpClient } from "@angular/common/http"
import { TranslateLoader } from "@ngx-translate/core"
import { NzI18nService } from "ng-zorro-antd/i18n"
import { catchError, Observable, of } from "rxjs"

export class I18nTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient, public prefix: string, private nzI18n: NzI18nService) {}
  public getTranslation(lang: string): Observable<Object> {
    import(`ng-zorro-antd/i18n`).then(i18nModule => {
      let nzLang = lang.replace('-', '_')
      try {
        this.nzI18n.setLocale((i18nModule as any)[nzLang])
      } catch(err) {
        console.warn(`Invalid locale provided to NzI18nService: ${nzLang}`, i18nModule)
      }
    })
    return this.http.get(`${this.prefix}${lang}`)
      .pipe(catchError((err, caught) => of({})))
  }
}