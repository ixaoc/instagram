import { inject } from '@angular/core';

import {
  HttpHeaders,
  HttpRequest,
  HttpEvent,
  HttpHandlerFn,
} from '@angular/common/http';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap, finalize, filter, take } from 'rxjs/operators';

import { AuthService } from 'services';

export function AuthInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  const refreshSubject = new BehaviorSubject<boolean>(false);

  const isRefresh: {
    _value: boolean;
    value: boolean;
    $: Observable<boolean>;
  } = {
    _value: false,
    $: refreshSubject.asObservable(),

    get value() {
      return this._value;
    },

    set value(value) {
      this._value = value;
      refreshSubject.next(value);
    },
  };

  function addAccessToken(headers: HttpHeaders) {
    if (authService.access_token) {
      headers = headers.set(
        'Authorization',
        `Bearer ${authService.access_token}`
      );
    }

    return headers;
  }

  function retryRequest(request: HttpRequest<any>, next: HttpHandlerFn) {
    request = request.clone({
      headers: addAccessToken(request.headers),
    });

    return next(request);
  }

  request = request.clone({
    headers: addAccessToken(request.headers),
  });

  return next(request).pipe(
    catchError((err) => {
      if (err.error.message === 'access_token_expired') {
        if (isRefresh.value) {
          isRefresh.$.pipe(
            filter((x) => x),
            take(1),
            switchMap(() => {
              return retryRequest(request, next);
            })
          );
        } else {
          isRefresh.value = true;

          return authService.refreshToken().pipe(
            //timeout(2500),
            switchMap(() => {
              isRefresh.value = false;
              return retryRequest(request, next);
            })
          );
        }
      }

      return throwError(() => err);
    }),
    finalize(() => {
      //this.loadingService.stopLoader()
    })
  );
}
