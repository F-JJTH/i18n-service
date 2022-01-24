import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectLanguageComponent } from './select-language.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SelectLanguageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NzSelectModule,
  ],
  exports: [
    SelectLanguageComponent
  ]
})
export class SelectLanguageModule { }
