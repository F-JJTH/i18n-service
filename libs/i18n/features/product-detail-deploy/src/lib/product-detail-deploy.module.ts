import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailDeployComponent } from './product-detail-deploy.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProductDetailDeployComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ProductDetailDeployComponent }
    ])
  ],
})
export class ProductDetailDeployModule {}
