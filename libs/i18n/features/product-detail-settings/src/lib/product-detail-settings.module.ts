import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductDetailSettingsComponent } from './product-detail-settings.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FormsModule } from '@angular/forms';
import { GeneralComponent } from './general/general.component';
import { MembersComponent } from './members/members.component';
import { LanguagesComponent } from './languages/languages.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AddLanguageModalComponent } from './add-language-modal/add-language-modal.component';
import { SelectLanguageModule } from '@kizeo/ui';
import { AddEditMemberModalComponent } from './add-edit-member-modal/add-edit-member-modal.component';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProductDetailSettingsComponent,
    GeneralComponent,
    MembersComponent,
    LanguagesComponent,
    AddLanguageModalComponent,
    AddEditMemberModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ProductDetailSettingsComponent }
    ]),
    NzLayoutModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzFormModule,
    NzInputModule,
    NzTabsModule,
    NzDividerModule,
    NzTableModule,
    NzModalModule,
    NzCheckboxModule,
    NzRadioModule,
    NzSelectModule,
    NzIconModule,
    SelectLanguageModule,
    TranslateModule,
  ],
})
export class ProductDetailSettingsModule {}
