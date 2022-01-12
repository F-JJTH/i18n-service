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
import { ImportDefinitionsModalComponent } from './import-definitions-modal/import-definitions-modal.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ProductDetailDefinitionsComponent, ImportDefinitionsModalComponent],
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
    NzBadgeModule,
    NzModalModule,
    TranslateModule,
  ],
})
export class ProductDetailDefinitionsModule {}
