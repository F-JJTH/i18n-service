import { Inject, Optional, Pipe, PipeTransform } from '@angular/core';
import { LocaleDate } from './locale-date.class';
import format from 'date-fns/format';

@Pipe({
  name: 'localeDate'
})
export class LocaleDatePipe implements PipeTransform {
  constructor(@Inject('DATE_FNS_LOCALE') @Optional() private dateFnsLocale: LocaleDate) {}

  transform(value: any, ...args: any[]): any {
    const [formatArg, timezone, locale] = args
    if (typeof value === 'string') {
      value = new Date(value)
    }

    switch(formatArg) {
      case 'short':
        return format(value, 'Pp', {locale: this.dateFnsLocale?.getLocale() || undefined})
    }
  }
}