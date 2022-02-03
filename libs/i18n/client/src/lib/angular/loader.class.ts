import { HttpClient } from "@angular/common/http"
import { TranslateLoader } from "@ngx-translate/core"
import { catchError, Observable, of } from "rxjs"

export class I18nTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient, public prefix: string) {}
  public getTranslation(lang: string): Observable<Object> {
    return this.http.get(`${this.prefix}${lang}`)
      .pipe(catchError((err, caught) => of({})))
  }
}