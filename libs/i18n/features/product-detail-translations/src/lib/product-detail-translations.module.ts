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

@NgModule({
  declarations: [ProductDetailTranslationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ProductDetailTranslationsComponent }
    ]),
    FormsModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzLayoutModule,
    SelectLanguageModule,
  ],
})
export class ProductDetailTranslationsModule {}
