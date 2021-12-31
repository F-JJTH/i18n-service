import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route, PreloadAllModules } from '@angular/router';
import { ShellComponent } from './shell.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout'
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { DataAccessModule } from '@kizeo/i18n/data-access';
import { NzButtonModule } from 'ng-zorro-antd/button';

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
    RouterModule.forRoot(shellRoutes, {preloadingStrategy: PreloadAllModules}),
    DataAccessModule,
    NzMenuModule,
    NzButtonModule,
    NzLayoutModule,
  ],
  declarations: [
    ShellComponent
  ],
  exports: [
    ShellComponent
  ]
})
export class ShellModule {}
