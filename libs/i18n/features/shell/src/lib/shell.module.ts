import { Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route, PreloadAllModules } from '@angular/router';
import { ShellComponent } from './shell.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout'
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { DataAccessModule } from '@kizeo/i18n/data-access';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { I18nClientAngularModule } from '@kizeo/i18n/client';
import { JwtInterceptor } from './jwt.interceptor';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { LocaleDate } from '@kizeo/ui';

export const shellRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('@kizeo/i18n/features/product-list').then(m => m.ProductListModule),
  },
  {
    path: ':productId',
    loadChildren: () => import('@kizeo/i18n/features/product-detail').then(m => m.ProductDetailModule),
  },
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot(shellRoutes, {preloadingStrategy: PreloadAllModules}),
    DataAccessModule,
    NzMenuModule,
    NzButtonModule,
    NzLayoutModule,
    NzIconModule,
    NzDropDownModule,
    NzSpinModule,
    NzDrawerModule,
    TranslateModule,
    I18nClientAngularModule,
  ],
  declarations: [
    ShellComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: 'DATE_FNS_LOCALE', useClass: LocaleDate },
  ],
  exports: [
    ShellComponent
  ]
})
export class ShellModule {
  constructor(translate: TranslateService, nzI18n: NzI18nService, @Inject('DATE_FNS_LOCALE') localeDateFns: LocaleDate) {
    translate.onLangChange.subscribe(langChangeEvent => {
      import(`ng-zorro-antd/i18n`).then(i18nModule => {
        let nzLang = langChangeEvent.lang.replace('-', '_')
        try {
          nzI18n.setLocale((i18nModule as any)[nzLang])
        } catch(err) {
          console.warn(`Invalid locale provided to NzI18nService: ${nzLang}`, i18nModule)
        }
      })

      import(`date-fns/locale`).then(locales => {
        const locale =  (locales as any)[langChangeEvent.lang.substring(0, 2)]
        localeDateFns.setLocale(locale)
      })
    })
  }
}
