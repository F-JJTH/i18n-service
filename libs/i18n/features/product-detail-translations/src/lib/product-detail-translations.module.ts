import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductDetailTranslationsComponent } from './product-detail-translations.component';

@NgModule({
  declarations: [ProductDetailTranslationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ProductDetailTranslationsComponent }
    ])
  ],
})
export class ProductDetailTranslationsModule {}
