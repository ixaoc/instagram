import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { setLoader } from 'interceptors/loader.interceptor';
import { User, HistoryEvent } from 'services';

export interface Like {
  id: number;
  user_id: number;
  post_id: number;
  created: number;
  updated: number;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private history = new Subject<HistoryEvent>();
  history$: Observable<HistoryEvent> = this.history.asObservable();

  endpoint = '/likes';

  constructor(private http: HttpClient) {}

  create(data: { post_id: number }) {
    return this.http
      .post<Like>(this.endpoint, data, {
        context: setLoader(`like/create`),
      })
      .pipe(
        tap((response) => {
          this.history.next({
            name: 'create',
            data,
            response,
          });
        })
      );
  }

  delete(id: number) {
    return this.http
      .delete<null>(`${this.endpoint}/${id}`, {
        context: setLoader(`like/delete/${id}`),
      })
      .pipe(
        tap((response) => {
          this.history.next({
            name: 'delete',
            id,
            response,
          });
        })
      );
  }
}
