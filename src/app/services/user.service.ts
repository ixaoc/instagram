import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { setLoader } from 'interceptors/loader.interceptor';

const USER = 'user';

interface FormSave {
  saved: boolean;
  errors: Array<any>;
}

export interface User {
  id: number;
  username: string;
  avatar: string;
}

interface UserData {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.user.asObservable();

  constructor(private http: HttpClient, public router: Router) {
    const user = localStorage.getItem(USER);

    if (user) {
      this.user.next(JSON.parse(user));
    }
  }

  setUser(user: any) {
    localStorage.setItem(USER, JSON.stringify(user));
    this.user.next(user);
  }

  removeUser() {
    localStorage.removeItem(USER);
    this.user.next(null);
  }

  changePassword(currentPassword: string, newPassword: string) {
    // UserService.update({ plan_id: 2 })
    return this.http
      .post<FormSave>('/api/settings/change-password', {
        currentPassword,
        newPassword,
      })
      .pipe(
        tap((_) => {})
        //catchError(this.handleError<Project>('addProject'))
      );
  }

  getProfile() {
    return this.http.get<any>('/settings/profile', {
      context: setLoader('user/getProfile'),
    });
  }

  saveProfile(data: any) {
    return this.http
      .post<FormSave>('/settings/change-profile', data, {
        context: setLoader('user/saveProfile'),
      })
      .pipe(
        tap((_) => {})
        //catchError(this.handleError<Project>('addProject'))
      );
  }

  getInfo(username: string) {
    return this.http.get<User>('/user/profile', {
      params: new HttpParams().set('username', username),
      context: setLoader('user/profile'),
    });
  }

  changePlan(id: number) {
    return this.update({ plan_id: id });
  }

  // -----

  update(data: any) {
    return this.http.patch<User>('/user', data).subscribe((x) => {
      this.user.next(x);
    });
  }

  update2(data: any) {
    return this.http.patch<User>('/settings/save-profile', data);
  }
}
