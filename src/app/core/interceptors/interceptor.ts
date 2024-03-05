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
import { LoaderService } from '../services/loader/loader.service';

@Injectable()
export class Interceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];
  constructor(private router: Router, private loaderService: LoaderService) {}

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
      params: req.params.set('api_key', '77c54cdc5f-f8e3ad0cbb-s9vbt0'),
    });
    this.requests.push(req);
    this.loaderService.isLoading.next(true);

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (event.status === 200) {
              this.removeRequest(req);
            } else if (event.status === 403) {
              this.router.navigate(['/unauthorized']);
              this.removeRequest(req);
            }
          }
        },
        (err: any) => {
          this.removeRequest(req);
          if (err instanceof HttpErrorResponse) {
            if (err.error.message === 'Unauthenticated') {
              this.router.navigate(['/unauthorized']);
            }
            if (err.status == 403) {
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
