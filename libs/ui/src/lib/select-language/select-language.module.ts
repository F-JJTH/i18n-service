import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectLanguageComponent } from './select-language.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SelectLanguageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NzSelectModule,
  ],
  exports: [
    SelectLanguageComponent
  ]
})
export class SelectLanguageModule { }
