import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  HttpContext,
  HttpContextToken,
} from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, map, tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
//import { User, UserData } from '@app/models'
import { User, UserService, LoaderService } from 'services';
import { setLoader } from 'interceptors/loader.interceptor';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

interface UserInfo {
  access_token: string;
  refresh_token: string;
  user: any; //User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private subject = new BehaviorSubject<User | null>(null);

  user$: Observable<User | null> = this.subject.asObservable();
  access_token: string | null;
  refresh_token: string | null;

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  api = {
    registration: '/auth/registration',
    activation: '/auth/activation',
    refreshActivationCode: '/auth/refresh-activation-code',
    recovery: '/auth/recovery',
    login: '/auth/login',
    logout: '/auth/logout',
    refreshTokens: '/auth/refresh',
  };

  constructor(
    private http: HttpClient,
    public router: Router,
    private userService: UserService,
    private loaderService: LoaderService
  ) {
    this.isLoggedIn$ = this.userService.user$.pipe(map((user) => !!user));
    this.isLoggedOut$ = this.userService.user$.pipe(map((user) => !user));

    this.access_token = localStorage.getItem(ACCESS_TOKEN);
    this.refresh_token = localStorage.getItem(REFRESH_TOKEN);
  }

  setToken(name: string, value: string) {
    // @ts-ignore
    this[name] = value;
    localStorage.setItem(name, value);
  }

  removeToken(name: string) {
    // @ts-ignore
    this[name] = null;
    localStorage.removeItem(name);
  }

  refreshToken() {
    return this.http
      .post<any>(
        this.api.refreshTokens,
        {
          refresh_token: this.refresh_token,
        },
        {
          context: setLoader('auth/refreshToken'),
        }
      )
      .pipe(
        tap(({ access_token }) => {
          this.setToken(ACCESS_TOKEN, access_token);
        })
      );
  }

  registration(email: string, password: string) {
    return this.http.post<any>(
      this.api.registration,
      {
        email,
        password,
      },
      {
        context: setLoader('auth/registration'),
      }
    );
  }

  activation(email: string, password: string, code: string) {
    return this.http
      .post<any>(
        this.api.activation,
        {
          email,
          password,
          code,
        },
        {
          context: setLoader('auth/activation'),
        }
      )
      .pipe(
        tap(({ access_token, refresh_token, user }) => {
          this.setToken(ACCESS_TOKEN, access_token);
          this.setToken(REFRESH_TOKEN, refresh_token);

          this.userService.setUser(user);
          this.router.navigate(['/'], { onSameUrlNavigation: 'reload' });
        })
        //catchError(this.handleError<Project>('addProject'))
      );
  }

  refreshActivationCode(email: string, password: string) {
    return this.http.post<any>(
      this.api.refreshActivationCode,
      {
        email,
        password,
      },
      {
        context: setLoader('auth/activation-new-code'),
      }
    );
  }

  initRecovery(email: string) {
    return this.http.post<any>(
      this.api.recovery,
      {
        email,
      },
      {
        context: setLoader('auth/initRecovery'),
      }
    );
  }

  checkRecoveryKey(key: string) {
    return this.http.post<any>(
      this.api.recovery,
      {
        key,
      },
      {
        context: setLoader('auth/checkRecoveryKey'),
      }
    );
  }

  setNewPassword(key: string, password: string) {
    return this.http
      .post<any>(
        this.api.recovery,
        {
          key,
          password,
        },
        {
          context: setLoader('auth/setNewPassword'),
        }
      )
      .pipe(
        tap(({ access_token, refresh_token, user }) => {
          this.setToken(ACCESS_TOKEN, access_token);
          this.setToken(REFRESH_TOKEN, refresh_token);

          this.userService.setUser(user);
          this.router.navigate(['/'], { onSameUrlNavigation: 'reload' });
        })
      );
  }

  login(email: string, password: string): Observable<UserInfo> {
    return this.http
      .post<UserInfo>(
        this.api.login,
        {
          email,
          password,
        },
        {
          context: setLoader('auth/login'),
        }
      )
      .pipe(
        tap(({ access_token, refresh_token, user }) => {
          this.setToken(ACCESS_TOKEN, access_token);
          this.setToken(REFRESH_TOKEN, refresh_token);

          this.userService.setUser(user);
          this.router.navigate(['/'], { onSameUrlNavigation: 'reload' });
        })
      );
  }

  logout() {
    this.http
      .post(
        this.api.logout,
        {
          access_token: this.access_token,
          refresh_token: this.refresh_token,
        },
        {
          context: setLoader('auth/logout'),
        }
      )
      .subscribe(() => {});

    this.removeToken(ACCESS_TOKEN);
    this.removeToken(REFRESH_TOKEN);
    this.userService.removeUser();
    this.router.navigate(['/'], { onSameUrlNavigation: 'reload' });
  }
}
