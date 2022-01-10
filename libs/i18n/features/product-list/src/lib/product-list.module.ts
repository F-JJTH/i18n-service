import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataAccessModule } from '@kizeo/i18n/data-access';
import { ProductListComponent } from './product-list.component';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CreateNewAppModalComponent } from "./create-new-app-modal/create-new-app-modal.component";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzFormModule } from "ng-zorro-antd/form";
import { FormsModule } from "@angular/forms";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzSkeletonModule } from "ng-zorro-antd/skeleton";
import { NzResultModule } from "ng-zorro-antd/result";
import { SelectLanguageModule } from '@kizeo/ui';

@NgModule({
  declarations: [ProductListComponent, CreateNewAppModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    DataAccessModule,
    RouterModule.forChild([
      {path: '', pathMatch: 'full', component: ProductListComponent}
    ]),
    NzLayoutModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzTagModule,
    NzSkeletonModule,
    NzResultModule,
    SelectLanguageModule,
  ],
})
export class ProductListModule {}
