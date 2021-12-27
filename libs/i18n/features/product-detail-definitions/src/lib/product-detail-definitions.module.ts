import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailDefinitionsComponent } from './product-detail-definitions.component';
import { RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [ProductDetailDefinitionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ProductDetailDefinitionsComponent }
    ]),
    FormsModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzLayoutModule,
    NzGridModule,
    NzButtonModule,
  ],
})
export class ProductDetailDefinitionsModule {}
