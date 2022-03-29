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
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { SetLinkModalComponent } from './set-link-modal/set-link-modal.component';
import { SetPictureModalComponent } from './set-picture-modal/set-picture-modal.component';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageModule } from 'ng-zorro-antd/message';

@NgModule({
  declarations: [
    ProductDetailDefinitionsComponent,
    ImportDefinitionsModalComponent,
    SetLinkModalComponent,
    SetPictureModalComponent,
  ],
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
    NzIconModule,
    NzDropDownModule,
    NzPopoverModule,
    NzImageModule,
    NzUploadModule,
    NzPopconfirmModule,
    NzMessageModule,
    TranslateModule,
  ],
})
export class ProductDetailDefinitionsModule {}
