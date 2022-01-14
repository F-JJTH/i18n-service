import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { NzI18nModule, NzI18nService } from 'ng-zorro-antd/i18n';
import { I18nTranslateLoader } from './loader.class';
import { AngularLanguageSelectorComponent } from './language-selector.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';

export class I18nClientConfig {
  appId = ''
  env = ''
  url = ''
}

export function createTranslateLoader(http: HttpClient, config: I18nClientConfig, nzI18n: NzI18nService) {
  return new I18nTranslateLoader(http, `${config.url}/public/product/${config.appId}/${config.env}/translation/`, nzI18n);
}

function initializeAppFactory(http: HttpClient, translate: TranslateService, config: I18nClientConfig): () => Observable<any> {
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
  declarations: [
    AngularLanguageSelectorComponent,
  ],
  imports: [
    CommonModule,
    NzI18nModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient, I18nClientConfig, NzI18nService]
      },
    }),
    NzDropDownModule,
    NzIconModule,
    NzButtonModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [HttpClient, TranslateService, I18nClientConfig],
      multi: true
    },
  ],
  exports: [
    AngularLanguageSelectorComponent,
  ]
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