import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  StateKey,
  makeStateKey,
  TransferState
} from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransferStateInterceptorService implements HttpInterceptor {
  constructor(
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    const key: StateKey<string> = makeStateKey<string>(request.url);

    if (isPlatformServer(this.platformId)) {
      return next.handle(request).pipe(
        tap(event => {
          this.transferState.set(key, (event as HttpResponse<any>).body);
        })
      );
    } else {
      const storedResponse = this.transferState.get<any>(key, null);

      if (storedResponse) {
        const response = new HttpResponse({
          body: storedResponse,
          status: 200
        });
        this.transferState.remove(key);
        return of(response);
      } else {
        return next.handle(request);
      }
    }
  }
}