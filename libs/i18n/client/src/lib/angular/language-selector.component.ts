import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kizeo-i18n-client-language-selector',
  template: `
  <button nz-button nz-dropdown nzTrigger="click" [nzDropdownMenu]="menu">
    <i nz-icon nzType="translation" nzTheme="outline"></i>
  </button>
  <nz-dropdown-menu #menu="nzDropdownMenu">
    <ul nz-menu>
      <li nz-menu-item
        *ngFor="let language of translate.getLangs()"
        (click)="translate.use(language)"
        [nzSelected]="language === translate.currentLang">
        {{ language }}
      </li>
    </ul>
  </nz-dropdown-menu>`,

})
export class AngularLanguageSelectorComponent {
  constructor(public readonly translate: TranslateService) {}
}