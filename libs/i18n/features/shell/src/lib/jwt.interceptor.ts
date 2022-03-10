import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { from, mergeMap, Observable } from 'rxjs';
import { CurrentUserService } from '@kizeo/i18n/data-access';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor (private readonly currentUser: CurrentUserService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.currentUser.getCurrentSession()).pipe(
      mergeMap(session => {
        if (!req.url.includes('client.translate.kizeo.dev')) {
          const jwt = session.getIdToken().getJwtToken()
          req = req.clone({
            setHeaders: { Authorization: `Bearer ${jwt}` }
          });
        }
        return next.handle(req)
      })
    )
  }
}