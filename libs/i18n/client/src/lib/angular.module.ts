import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http';
import { catchError, from, Observable, of, tap } from 'rxjs';
import { NzI18nModule, NzI18nService } from 'ng-zorro-antd/i18n';

export class I18nClientConfig {
  appId = ''
  env = ''
  url = ''
}

class I18nTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient, public prefix: string) {}
  public getTranslation(lang: string): Observable<Object> {
    return this.http.get(`${this.prefix}${lang}`)
      .pipe(catchError((err, caught) => of({})))
  }
}

export function createTranslateLoader(http: HttpClient, config: I18nClientConfig) {
  return new I18nTranslateLoader(http, `${config.url}/public/product/${config.appId}/${config.env}/translation/`);
}

function initializeAppFactory(http: HttpClient, translate: TranslateService, config: I18nClientConfig, nzI18n: NzI18nService): () => Observable<any> {
  return () => {
    return http.get<string[]>(`${config.url}/public/product/${config.appId}/${config.env}/languages`)
    .pipe(
      catchError((err, caught) => of([])),
      tap(languages => {
        translate.addLangs(languages)
        const browserLanguage = translate.getBrowserLang()
        const defaultLanguage = languages.find(l => l.includes(browserLanguage!)) || languages[0]
        translate.setDefaultLang(defaultLanguage)
        translate.use(defaultLanguage)
      })
    );
  }
}

@NgModule({
  imports: [
    NzI18nModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient, I18nClientConfig]
      },
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [HttpClient, TranslateService, I18nClientConfig, NzI18nModule],
      multi: true
     }
  ],
})
export class I18nClientAngularModule {
  constructor(
    readonly config: I18nClientConfig,
    @Optional() @SkipSelf() parentModule?: I18nClientAngularModule,
  ) {
    if (parentModule) {
      throw new Error('I18nClientAngularModule is already loaded. Import it in the AppModule only')
    }
  }

  static forRoot(config: I18nClientConfig): ModuleWithProviders<I18nClientAngularModule> {
    return {
      ngModule: I18nClientAngularModule,
      providers: [
        { provide: I18nClientConfig, useValue: config },
      ],
    }
  }
}