import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailDeployComponent } from './product-detail-deploy.component';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';

@NgModule({
  declarations: [ProductDetailDeployComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ProductDetailDeployComponent }
    ]),
    NzLayoutModule,
    NzGridModule,
    NzAlertModule,
    NzButtonModule,
    NzIconModule,
  ],
})
export class ProductDetailDeployModule {}
