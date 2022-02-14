import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '@kizeo/i18n/data-access';
import { IEnvironment } from '@kizeo/i18n/util';

@Component({
  selector: 'kizeo-i18n-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  @Input() user!: {attributes: {sub: string, email: string, email_verified: boolean}}
  @Input() signOut!: Function

  hasCurrentSession = false

  constructor(
    private readonly router: Router,
    @Inject('ENVIRONMENT') public environment: IEnvironment,
    private readonly currentUser: CurrentUserService
  ) {
    this.currentUser.setCurrentSession().then(() => this.hasCurrentSession = true)
  }

  logout() {
    this.router.navigateByUrl('/')
    this.signOut()
  }
}
