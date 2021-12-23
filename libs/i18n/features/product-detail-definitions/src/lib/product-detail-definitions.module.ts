import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailDefinitionsComponent } from './product-detail-definitions.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProductDetailDefinitionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ProductDetailDefinitionsComponent }
    ])
  ],
})
export class ProductDetailDefinitionsModule {}
