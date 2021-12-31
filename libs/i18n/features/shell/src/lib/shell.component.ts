import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'kizeo-i18n-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  @Input() user!: {attributes: {sub: string, email: string, email_verified: boolean}}
  @Input() signOut!: Function

  constructor(private readonly router: Router) {}

  logout() {
    this.signOut()
    this.router.navigateByUrl('/')
  }
}
