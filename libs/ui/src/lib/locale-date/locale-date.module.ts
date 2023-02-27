import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LocaleDatePipe } from './locale-date.pipe';

@NgModule({
  imports: [CommonModule],
  exports: [LocaleDatePipe],
  declarations: [LocaleDatePipe],
})
export class LocaleDateModule { }
