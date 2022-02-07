import { NgModule } from '@angular/core';
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
import { CurrentProductService } from 'libs/i18n/features/product-detail/src/lib/current-product.service';

export const shellRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('@kizeo/i18n/features/product-list').then(m => m.ProductListModule)
  },
  {
    path: ':productId',
    loadChildren: () => import('@kizeo/i18n/features/product-detail').then(m => m.ProductDetailModule)
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
    TranslateModule,
    I18nClientAngularModule,
  ],
  declarations: [
    ShellComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    CurrentProductService,
  ],
  exports: [
    ShellComponent
  ]
})
export class ShellModule {
  constructor(translate: TranslateService, nzI18n: NzI18nService) {
    translate.onLangChange.subscribe(langChangeEvent => {
      import(`ng-zorro-antd/i18n`).then(i18nModule => {
        let nzLang = langChangeEvent.lang.replace('-', '_')
        try {
          nzI18n.setLocale((i18nModule as any)[nzLang])
        } catch(err) {
          console.warn(`Invalid locale provided to NzI18nService: ${nzLang}`, i18nModule)
        }
      })
    })
  }
}
