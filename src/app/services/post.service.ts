import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import _ from 'lodash';
import { Subject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { setLoader } from 'interceptors/loader.interceptor';
import { HistoryEvent, User, Comment, Meta } from 'services';

export interface Media {
  id: number;
  post_id: number;
  file: string;
  created: number;
  updated: number;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  created: number;
  updated: number;
  user: User;
  media: Media[];
  likes: number;
  comments: number;
  _comments: Comment[];
  controls: {
    liked: boolean;
    saved: boolean;
    followered: boolean;
    follow: any;
  };
}

interface PostAllResponse {
  items: Post[];
  _meta: Meta;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private history = new Subject<HistoryEvent>();
  history$: Observable<HistoryEvent> = this.history.asObservable();

  endpoint = '/post';

  constructor(private http: HttpClient, public router: Router) {}

  all(data: any) {
    let params = new HttpParams().set('without', false);

    _.forEach(data, (value, key) => {
      params = params.set(key, value);
    });

    return this.http
      .get<PostAllResponse>(this.endpoint, {
        params,
        context: setLoader('post/all'),
      })
      .pipe(
        tap((response) => {
          this.history.next({
            name: 'all',
            data,
            response,
          });
        })
      );
  }

  one(id: number) {
    return this.http
      .get<Post>(`${this.endpoint}/${id}`, {
        context: setLoader(`post/one/${id}`),
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
      .post<Post>(this.endpoint, data, {
        context: setLoader('post/create'),
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
      .patch<Post>(`${this.endpoint}/${id}`, data, {
        context: setLoader(`post/update/${id}`),
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
        context: setLoader(`post/delete/${id}`),
      })
      .pipe(
        tap((response) => {
          this.history.next({
            name: 'delete',
            id: id,
            response,
          });
        })
      );
  }
}
