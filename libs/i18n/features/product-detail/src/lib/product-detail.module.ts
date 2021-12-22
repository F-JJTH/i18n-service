import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { ProductDetailComponent } from './product-detail.component';

export const productDetailRoutes: Route[] = [
  { path: '', redirectTo: 'settings' },
  {
    path: 'settings',
    loadChildren: () => import('@kizeo/i18n/features/product-detail-settings').then(m => m.ProductDetailSettingsModule)
  },
  {
    path: 'languages',
    loadChildren: () => import('@kizeo/i18n/features/product-detail-languages').then(m => m.ProductDetailLanguagesModule)
  },
  {
    path: 'definitions',
    loadChildren: () => import('@kizeo/i18n/features/product-detail-definitions').then(m => m.ProductDetailDefinitionsModule)
  },
  {
    path: 'translations',
    loadChildren: () => import('@kizeo/i18n/features/product-detail-translations').then(m => m.ProductDetailTranslationsModule)
  },
  {
    path: 'deploy',
    loadChildren: () => import('@kizeo/i18n/features/product-detail-deploy').then(m => m.ProductDetailDeployModule)
  },
];

@NgModule({
  declarations: [ProductDetailComponent],
  imports: [CommonModule, RouterModule.forChild(productDetailRoutes)],
  bootstrap: [ProductDetailComponent]
})
export class ProductDetailModule {}
