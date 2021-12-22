import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailSettingsComponent } from './product-detail-settings.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProductDetailSettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: ProductDetailSettingsComponent}
    ])
  ],
})
export class ProductDetailSettingsModule {}
