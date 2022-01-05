import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailTranslationsComponent } from './product-detail-translations.component';
import { RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { SelectLanguageModule } from '@kizeo/ui';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

@NgModule({
  declarations: [ProductDetailTranslationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ProductDetailTranslationsComponent }
    ]),
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzAlertModule,
    NzLayoutModule,
    NzToolTipModule,
    NzIconModule,
    NzBadgeModule,
    SelectLanguageModule,
  ],
})
export class ProductDetailTranslationsModule {}
