import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SelectLanguageModule } from '@kizeo/ui';
import { TranslateModule } from '@ngx-translate/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ProductDetailTranslationsComponent } from './product-detail-translations.component';
import { ImportTranslationsModalComponent } from './import-translations-modal/import-translations-modal.component';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { DeeplPipeModule } from './deepl.pipe';

@NgModule({
  declarations: [ProductDetailTranslationsComponent, ImportTranslationsModalComponent],
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
    NzImageModule,
    NzDropDownModule,
    NzModalModule,
    NzMessageModule,
    NzCheckboxModule,
    NzTypographyModule,
    SelectLanguageModule,
    TranslateModule,
    DeeplPipeModule,
  ],
})
export class ProductDetailTranslationsModule {}
