import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppsyncModule } from '@kizeo/i18n/appsync';
import { ProductListComponent } from './product-list.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProductListComponent],
  imports: [
    CommonModule,
    AppsyncModule,
    RouterModule.forChild([
      {path: '', pathMatch: 'full', component: ProductListComponent}
    ])
  ],
})
export class ProductListModule {}
