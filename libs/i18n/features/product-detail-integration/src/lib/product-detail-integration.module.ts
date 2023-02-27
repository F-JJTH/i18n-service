import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductDetailIntegrationComponent } from './product-detail-integration.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { TranslateModule } from '@ngx-translate/core';
import { NzTagModule } from 'ng-zorro-antd/tag';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ProductDetailIntegrationComponent }
    ]),
    TranslateModule,
    NzTagModule,
    NzLayoutModule,
  ],
  declarations: [
    ProductDetailIntegrationComponent
  ],
})
export class ProductDetailIntegrationModule {}
