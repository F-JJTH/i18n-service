import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrentUserService } from '@kizeo/i18n/data-access';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor (private readonly currentUser: CurrentUserService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${this.currentUser.idToken}` }
    });
    return next.handle(req);
  }
}