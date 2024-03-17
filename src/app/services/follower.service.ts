import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { setLoader } from 'interceptors/loader.interceptor';

import { Meta, HistoryEvent, Comment } from 'services';

interface FollowerAllResponse {
  items: Comment[];
  _meta: Meta;
}

@Injectable({
  providedIn: 'root',
})
export class FollowerService {
  private history = new Subject<HistoryEvent>();
  history$: Observable<HistoryEvent> = this.history.asObservable();

  endpoint = '/followers';
  extraEndpoints = {
    followers: '/followers/followers',
    deleteMySubscriber: '/followers/deleteMySubcriber',
  };

  constructor(private http: HttpClient) {}

  followers(id: number, query = '') {
    return this.http
      .get<FollowerAllResponse>(this.extraEndpoints.followers, {
        params: new HttpParams().set('id', id).set('query', query),
        context: setLoader('follower/followers'),
      })
      .pipe(
        tap((response) => {
          this.history.next({
            name: 'followers',
            id,
            query,
            response,
          });
        })
      );
  }

  list(id: number, query = '') {
    return this.http
      .get<FollowerAllResponse>(this.endpoint, {
        params: new HttpParams().set('id', id).set('query', query),
        context: setLoader('follower/list'),
      })
      .pipe(
        tap((response) => {
          this.history.next({
            name: 'my',
            id,
            query,
            response,
          });
        })
      );
  }

  create(id: number) {
    return this.http
      .post<any>(
        this.endpoint,
        { id },
        {
          context: setLoader(`$follower/create/{id}`),
        }
      )
      .pipe(
        tap((response) => {
          this.history.next({
            name: 'create',
            id,
            response,
          });
        })
      );
  }

  delete(id: number) {
    return this.http
      .delete<null>(`${this.endpoint}/${id}`, {
        context: setLoader(`follower/delete/${id}`),
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

  deleteMySubscriber(id: number) {
    return this.http
      .delete<any>(this.extraEndpoints.deleteMySubscriber, {
        params: new HttpParams().set('id', id),
        context: setLoader(`follower/deleteMySubscriber/${id}`),
      })
      .pipe(
        tap((response) => {
          this.history.next({
            name: 'deleteMySubscriber',
            id,
            response,
          });
        })
      );
  }
}
