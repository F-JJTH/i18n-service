import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from '@kizeo/i18n/data-access';
import { IEnvironment } from '@kizeo/i18n/util';

@Component({
  selector: 'kizeo-i18n-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  @Input() user!: {attributes: {sub: string, email: string, email_verified: boolean}}
  @Input() signOut!: Function

  constructor(
    private readonly router: Router,
    @Inject('ENVIRONMENT') public environment: IEnvironment,
    private readonly i18nSvc: I18nService,
  ) { }

  logout() {
    this.router.navigateByUrl('/')
    this.signOut()
  }
}
