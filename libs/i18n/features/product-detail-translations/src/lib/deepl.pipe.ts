import { Pipe, PipeTransform, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Pipe({
  name: 'deepl',
})
export class DeeplPipe implements PipeTransform {
  transform(value: string, languageSrc: string, languageDest: string): string {
    return `https://www.deepl.com/translator#${languageSrc.substring(0, 2)}/${languageDest.substring(0, 2)}/${value}`;
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [DeeplPipe],
  exports: [DeeplPipe],
})
export class DeeplPipeModule {}
