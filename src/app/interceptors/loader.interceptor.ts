import { inject } from '@angular/core';

import {
  HttpRequest,
  HttpEvent,
  HttpHandlerFn,
  HttpContext,
  HttpContextToken,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoaderService } from 'services';

const LOADER = new HttpContextToken<string>(() => 'loader');

export function setLoader(name: string) {
  return new HttpContext().set(LOADER, name);
}

export function LoaderInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const loaderService = inject(LoaderService);

  if (request.context.has(LOADER)) {
    loaderService.add(request.context.get(LOADER));
  }

  return next(request).pipe(
    finalize(() => {
      if (request.context.has(LOADER)) {
        loaderService.remove(request.context.get(LOADER));
      }
    })
  );
}
