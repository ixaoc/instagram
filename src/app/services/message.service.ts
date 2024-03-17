import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { setLoader } from 'interceptors/loader.interceptor';

import { HistoryEvent } from 'services';

export interface Message {
  id: number;
  authorId: number;
  placeId: number;
  placeManual: string;
  name: string;
  description: string;
  date: number;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private history = new Subject<HistoryEvent>();
  history$: Observable<HistoryEvent> = this.history.asObservable();
  lastMessageId = 1;

  endpoint = '/message';
  extraEndpoints = {
    chat: `${this.endpoint}/chat`,
    chats: `${this.endpoint}/chats`,
    check: `${this.endpoint}/check`,
  };

  constructor(private http: HttpClient, public router: Router) {}

  all(id: number) {
    return this.http
      .get<any>(this.extraEndpoints.chat, {
        params: new HttpParams().set('id', id),
        context: setLoader('message/all'),
      })
      .pipe(
        tap((response) => {
          this.history.next({
            name: 'all',
            id,
            response,
          });
        })
      );
  }

  chats() {
    return this.http.get<any>(this.extraEndpoints.chats).pipe(
      tap((response) => {
        this.history.next({
          name: 'chats',
          response,
        });
      })
    );
  }

  check(id: number) {
    return this.http
      .get<any>(this.extraEndpoints.check, {
        params: new HttpParams().set('id', this.lastMessageId),
      })
      .pipe(
        tap((response) => {
          this.lastMessageId++;
          this.history.next({
            name: 'check',
            id,
            response,
          });
        })
      );
  }

  one(id: number) {
    return this.http
      .get<any>(`${this.endpoint}/${id}`, {
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
      .post<any>(this.endpoint, data, {
        context: setLoader(`message/create`),
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
      .patch<any>(`${this.endpoint}/${id}`, data, {
        context: setLoader(`message/update/${id}`),
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
      .delete<any>(`${this.endpoint}/${id}`, {
        context: setLoader(`message/delete/${id}`),
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
