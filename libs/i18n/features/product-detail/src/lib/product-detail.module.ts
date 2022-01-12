import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { ProductDetailComponent } from './product-detail.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ProductResolver } from './product.resolver';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { TranslateModule } from '@ngx-translate/core';

export const productDetailRoutes: Route[] = [
  {
    path: '',
    component: ProductDetailComponent,
    resolve: { product: ProductResolver },
    children: [
      {
        path: 'translations',
        loadChildren: () => import('@kizeo/i18n/features/product-detail-translations').then(m => m.ProductDetailTranslationsModule),
      },
      {
        path: 'definitions',
        loadChildren: () => import('@kizeo/i18n/features/product-detail-definitions').then(m => m.ProductDetailDefinitionsModule)
      },
      {
        path: 'deploy',
        loadChildren: () => import('@kizeo/i18n/features/product-detail-deploy').then(m => m.ProductDetailDeployModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('@kizeo/i18n/features/product-detail-settings').then(m => m.ProductDetailSettingsModule)
      },
      { path: '', redirectTo: 'translations'},
    ]
  },
];

@NgModule({
  declarations: [ProductDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(productDetailRoutes),
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzSkeletonModule,
    TranslateModule,
  ],
})
export class ProductDetailModule {}
