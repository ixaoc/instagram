import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import _ from 'lodash';
import { Subject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { setLoader } from 'interceptors/loader.interceptor';
import { User, Post, Meta, HistoryEvent } from 'services';

export interface Save {
  id: number;
  user_id: number;
  post_id: number;
  created: number;
  updated: number;
  user: User;
  post: Post;
}

interface SaveAllResponse {
  items: Save[];
  _meta: Meta;
}

@Injectable({
  providedIn: 'root',
})
export class SaveService {
  private history = new Subject<HistoryEvent>();
  history$: Observable<HistoryEvent> = this.history.asObservable();

  endpoint = '/saves';

  constructor(private http: HttpClient) {}

  all(data: any) {
    let params = new HttpParams();

    _.forEach(data, (value, key) => {
      params = params.set(key, value);
    });

    return this.http
      .get<SaveAllResponse>(this.endpoint, {
        params,
        context: setLoader('save/all'),
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

  create(data: { post_id: number }) {
    return this.http
      .post<Save>(this.endpoint, data, {
        context: setLoader(`save/create`),
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
        context: setLoader(`save/delete/${id}`),
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
