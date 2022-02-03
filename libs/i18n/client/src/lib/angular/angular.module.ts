import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core'
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { I18nTranslateLoader } from './loader.class';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { IconDefinition } from '@ant-design/icons-angular';
import { TranslationOutline } from '@ant-design/icons-angular/icons';
import { AngularLanguageSelectorComponent } from './language-selector.component';
import { I18N_API_URL } from '../util';

const icons: IconDefinition[] = [TranslationOutline];

export class I18nClientConfig {
  appId = ''
  env?: string
  url?: string

  constructor(config: I18nClientConfig) {
    this.appId = config.appId
    this.env = config.env || 'prod'
    this.url = config.url || I18N_API_URL
  }
}

export function createTranslateLoader(http: HttpClient, config: I18nClientConfig) {
  return new I18nTranslateLoader(http, `${config.url}/public/product/${config.appId}/${config.env}/translation/`);
}

function initializeAppFactory(http: HttpClient, translate: TranslateService, config: I18nClientConfig): () => Observable<any> {
  return () => {
    translate.onLangChange.subscribe(e => {
      localStorage.setItem(`i18n-client-${config.appId}`, e.lang)
    })
    return http.get<string[]>(`${config.url}/public/product/${config.appId}/${config.env}/languages`)
    .pipe(
      catchError((err, caught) => of([])),
      tap(languages => {
        translate.addLangs(languages)
        const savedLanguage = localStorage.getItem(`i18n-client-${config.appId}`)
        const browserLanguage = translate.getBrowserLang()
        const defaultLanguage = languages.find(l => l.includes(browserLanguage!)) || languages[0]
        translate.setDefaultLang(defaultLanguage)
        translate.use(savedLanguage || defaultLanguage)
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
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient, I18nClientConfig]
      },
    }),
    NzDropDownModule,
    NzIconModule.forRoot(icons),
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
    TranslateModule,
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
        { provide: I18nClientConfig, useValue: new I18nClientConfig(config) },
      ],
    }
  }
}