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
import {ProductGuard} from "./product.guard";

export const productDetailRoutes: Route[] = [
  {
    path: '',
    component: ProductDetailComponent,
    resolve: { product: ProductResolver },
    children: [
      {
        path: 'translations',
        loadChildren: () => import('@kizeo/i18n/features/product-detail-translations').then(m => m.ProductDetailTranslationsModule),
        canLoad:[ProductGuard]
      },
      {
        path: 'definitions',
        loadChildren: () => import('@kizeo/i18n/features/product-detail-definitions').then(m => m.ProductDetailDefinitionsModule),
        canLoad:[ProductGuard]
      },
      {
        path: 'deploy',
        loadChildren: () => import('@kizeo/i18n/features/product-detail-deploy').then(m => m.ProductDetailDeployModule),
        canLoad:[ProductGuard]
      },
      {
        path: 'settings',
        loadChildren: () => import('@kizeo/i18n/features/product-detail-settings').then(m => m.ProductDetailSettingsModule),
        canLoad:[ProductGuard]
      },
      {
        path: 'integration',
        loadChildren: () => import('@kizeo/i18n/features/product-detail-integration').then(m => m.ProductDetailIntegrationModule)
      },
      { path: '', pathMatch: 'full', redirectTo: 'definitions'},
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
  providers: [ProductGuard]
})
export class ProductDetailModule {}
