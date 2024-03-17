import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';

type Errors = Record<string, string>;

@Injectable()
export class ErrorService {
  items: Errors = {};

  private subject = new BehaviorSubject<Errors>({});

  items$: Observable<Errors> = this.subject.asObservable();

  //err = obsValue({})
  // _items: {
  //   value: Errors;
  //   set: () => {};
  //   get: () => {};
  //   $: Observable<Errors>;
  // } = {
  //   value: {},
  //   set: () => {},
  //   get: () => {},
  //   $: this.subject.asObservable(),
  // };

  // errorService.add('email', 'text')
  add(name: string, value: string): void {
    this.items[name] = value;
    this.subject.next(this.items);
  }
  // errorService.add('email', 'text')
  has(name: string): boolean {
    return this.items[name] ? true : false;
  }
  // errorService.get('email')
  get(name: string): string | undefined {
    return this.items[name];
  }

  remove(name: string): void {
    delete this.items[name];
    this.subject.next(this.items);
  }
}
