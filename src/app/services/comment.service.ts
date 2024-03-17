import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { setLoader } from 'interceptors/loader.interceptor';
import { User, Meta, HistoryEvent } from 'services';

export interface Comment {
  id: number;
  post_id: number;
  text: string;
  created: number;
  updated: number;
  user: User;
}

interface CommentAllResponse {
  items: Comment[];
  _meta: Meta;
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private history = new Subject<HistoryEvent>();
  history$: Observable<HistoryEvent> = this.history.asObservable();

  endpoint = '/comments';

  constructor(private http: HttpClient) {}

  all(id: number) {
    return this.http
      .get<CommentAllResponse>(this.endpoint, {
        params: new HttpParams().set('post_id', id),
        context: setLoader('comment/all'),
      })
      .pipe(
        tap((response) => {
          this.history.next({
            name: 'all',
            response,
          });
        })
      );
  }

  one(id: number) {
    return this.http
      .get<Comment>(`${this.endpoint}/${id}`, {
        context: setLoader(`comment/one/${id}`),
      })
      .pipe(
        tap((response) => {
          this.history.next({
            name: 'one',
            id,
            response,
          });
        })
      );
  }

  create(data: any) {
    return this.http
      .post<Comment>(this.endpoint, data, {
        context: setLoader(`comment/create`),
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

  update(id: number, data: any) {
    return this.http
      .patch<Comment>(`${this.endpoint}/${id}`, data, {
        context: setLoader(`comment/update/${id}`),
      })
      .pipe(
        tap((response) => {
          this.history.next({
            name: 'update',
            id,
            data,
            response,
          });
        })
      );
  }

  delete(id: number) {
    return this.http
      .delete<null>(`${this.endpoint}/${id}`, {
        context: setLoader(`comment/delete/${id}`),
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
