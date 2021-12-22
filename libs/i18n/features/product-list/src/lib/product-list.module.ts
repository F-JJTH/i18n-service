import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppsyncModule } from '@kizeo/i18n/appsync';
import { ProductListComponent } from './product-list.component';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [ProductListComponent],
  imports: [
    CommonModule,
    AppsyncModule,
    RouterModule.forChild([
      {path: '', pathMatch: 'full', component: ProductListComponent}
    ]),
    NzLayoutModule,
    NzButtonModule,
  ],
})
export class ProductListModule {}
