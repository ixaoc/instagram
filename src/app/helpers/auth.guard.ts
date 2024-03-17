import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanMatch,
  Router,
  Route,
  UrlSegment,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AuthService } from 'services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanMatch {
  constructor(private authService: AuthService, private router: Router) {}

  canMatch(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isLoggedIn$;
  }
}
