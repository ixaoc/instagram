import { inject } from '@angular/core';

import {
  HttpHeaders,
  HttpRequest,
  HttpEvent,
  HttpHandlerFn,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from 'app/../environments/environment';

import { AuthService } from 'services';

export function RequestInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  let headers = getHeaders(request.headers);
  const url = environment.apiUrl + request.url;
  request = request.clone({ url, headers });

  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  function getHeaders(headers: HttpHeaders) {
    if (request.body instanceof FormData) {
      return headers;
    }

    headers = headers.set('Accept', 'application/json');
    headers = headers.set('Content-Type', 'application/json');

    return headers;
  }

  return next(request).pipe(
    catchError((err) => {
      console.log(err);

      if (err.error.status === 401) {
        authService.logout();
      }

      return throwError(() => err);
    })
  );
}
