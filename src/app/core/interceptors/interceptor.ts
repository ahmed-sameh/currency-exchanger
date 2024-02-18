import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpResponse,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/auth/auth.service';
import { LoaderService } from '../services/loader/loader.service';

@Injectable()
export class Interceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];
  constructor(
    private _auth: AuthenticationService,
    private router: Router,
    private loaderService: LoaderService
  ) {}

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let request = req.clone({
      params: req.params.set('api_key', 'ad7adfde55-138dc063ec-s92m78'),
    });

    this.requests.push(req);
    this.loaderService.isLoading.next(true);

    // if token exits will be added to request params

    if (this._auth.Token) {
      request = request.clone({
        setParams: {
          access_key: this._auth.Token,
        },
      });
    }

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (event.status === 200) {
              this.removeRequest(req);
            } else if (event.status === 403) {
              this._auth.expiredTokenSubject.next(true);
              this.router.navigate(['/unauthorized']);
              this.removeRequest(req);
            }
          }
        },
        (err: any) => {
          this.removeRequest(req);
          if (err instanceof HttpErrorResponse) {
            if (err.error.message === 'Unauthenticated') {
              this._auth.expiredTokenSubject.next(true);
              this.router.navigate(['/unauthorized']);
            }
            if (err.status == 403) {
              this._auth.expiredTokenSubject.next(true);
              this.router.navigate(['/unauthorized']);
              this.removeRequest(req);
            }
          }
          this.removeRequest(req);

          return of(err);
        }
      )
    );
  }
}
