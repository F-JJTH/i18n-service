import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kizeo-i18n-client-language-selector',
  template: `
  <button nz-button nz-dropdown nzTrigger="click" [nzDropdownMenu]="menu">
    <i nz-icon nzType="translation" nzTheme="outline"></i>
  </button>
  <nz-dropdown-menu #menu="nzDropdownMenu">
    <ul nz-menu>
      <li nz-menu-item *ngFor="let language of languages" (click)="selectLanguage(language)">{{ language }}</li>
    </ul>
  </nz-dropdown-menu>`,

})
export class AngularLanguageSelectorComponent implements OnInit {
  languages: string[] = []

  constructor(private readonly translate: TranslateService) { }

  ngOnInit() {
    this.languages = this.translate.getLangs()
  }

  selectLanguage(language: string) {
    this.translate.use(language)
  }
}