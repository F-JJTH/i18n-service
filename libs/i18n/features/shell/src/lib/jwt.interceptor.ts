import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { from, mergeMap, Observable } from 'rxjs';
import { CurrentUserService } from '@kizeo/i18n/data-access';

const EXCLUDE_DOMAINS = [
  'notion.site',
  'client.translate.kizeo.dev',
]

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor (private readonly currentUser: CurrentUserService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.currentUser.getCurrentSession()).pipe(
      mergeMap(session => {
        if (!EXCLUDE_DOMAINS.find(d => req.url.includes(d))) {
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